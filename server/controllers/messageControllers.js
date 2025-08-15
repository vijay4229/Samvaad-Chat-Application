import Message from '../models/messageModel.js';
import user from '../models/userModel.js';
import Chat from '../models/chatModel.js';
import cloudinary from '../config/cloudinary.js';
import axios from 'axios';
import { getFilenameFromUrl } from '../utils/helpers.js';

export const sendMessage = async (req, res) => {
  const { chatId, message } = req.body;
  try {
    let msg = await Message.create({ sender: req.rootUserId, message, chatId });
    msg = await (
      await msg.populate('sender', 'name profilePic email')
    ).populate({
      path: 'chatId',
      select: 'chatName isGroup users',
      model: 'Chat',
      populate: {
        path: 'users',
        select: 'name email profilePic',
        model: 'User',
      },
    });
    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: msg,
    });
    res.status(200).send(msg);
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error });
  }
};

export const getMessages = async (req, res) => {
  const { chatId } = req.params;
  try {
    let messages = await Message.find({ chatId })
      .populate({
        path: 'sender',
        model: 'User',
        select: 'name profilePic email',
      })
      .populate({
        path: 'chatId',
        model: 'Chat',
      });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error });
    console.log(error);
  }
};

// --- THIS IS THE FINAL, CORRECT UPLOAD FUNCTION ---
export const uploadFile = async (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  return new Promise((resolve, reject) => {
    // Check the file's mimetype to determine the correct resource_type
    let resourceType = 'auto';
    if (req.file.mimetype === 'application/pdf') {
      resourceType = 'raw';
    }
    // You could add more checks here for other file types like 'video'

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        upload_preset: 'chat_app_files', // Use the specific public preset
        resource_type: resourceType,     // Set the resource type correctly
        // Use the original filename as the public_id to preserve it
        public_id: req.file.originalname.substring(0, req.file.originalname.lastIndexOf('.'))
      },
      (error, result) => {
        if (error) {
          console.error('Upload to Cloudinary failed:', error);
          reject(new Error('Upload to Cloudinary failed.'));
          return res.status(500).send('Upload to Cloudinary failed.');
        }
        res.status(200).json({ url: result.secure_url });
        resolve();
      }
    );
    uploadStream.end(req.file.buffer);
  });
};


export const downloadFile = async (req, res) => {
    const fileUrl = req.query.url;
    if (!fileUrl) {
        return res.status(400).send('No file URL provided.');
    }

    try {
        const filename = getFilenameFromUrl(fileUrl);
        res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
        const response = await axios({
            method: 'GET',
            url: fileUrl,
            responseType: 'stream'
        });
        response.data.pipe(res);
    } catch (error) {
        console.error('Error downloading file:', error);
        res.status(500).send('Failed to download file.');
    }
};
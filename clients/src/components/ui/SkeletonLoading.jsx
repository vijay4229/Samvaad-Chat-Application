// src/components/ui/SkeletonLoading.jsx
import React from 'react';
import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

function SkeletonLoading({ height, count }) {
    // These colors are from your Tailwind theme (bkg-light and border)
    const baseColor = "#1f2937";
    const highlightColor = "#4b5563";

    return (
        <SkeletonTheme baseColor={baseColor} highlightColor={highlightColor}>
            <Skeleton
                style={{ height: `${height}px`, width: "100%", marginBottom: '10px' }}
                count={count}
            />
        </SkeletonTheme>
    );
}

export default SkeletonLoading;
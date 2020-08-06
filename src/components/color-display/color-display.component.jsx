import React from "react";
//
import "bootstrap";
import './color-display.styles.css';

const ColorDisplay = ({colors}) => (
    <div className='color-display'>
        {
            Object.keys(colors).map(key => (
                <div className='d-flex flex-column color-detail-container'>
                    <div className='color-point' style={{border: '4px solid #3788d8',borderColor: colors[key]}}></div>
                    <div className='color-description'>{key}</div>
                </div>
            ))
        }

    </div>
)

export default ColorDisplay;
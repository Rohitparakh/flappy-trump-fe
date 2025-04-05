
import React from 'react';

interface PipeProps {
  x: number;
  height: number;
  pipeGap: number;
  gameHeight: number;
}

const Pipe: React.FC<PipeProps> = ({ x, height, pipeGap, gameHeight }) => {
  const pipeWidth = 60;
  
  return (
    <>
      {/* Top pipe */}
      <div
        className="pipe"
        style={{
          left: `${x}px`,
          top: 0,
          width: `${pipeWidth}px`,
          height: `${height}px`,
          borderBottomLeftRadius: '5px',
          borderBottomRightRadius: '5px',
          backgroundColor: '#506C37', // Darker green
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
          position: 'absolute',
          border: '1px solid #3A4B29',
        }}
      >
        <div className="absolute bottom-0 w-full h-4 bg-[#3A4B29] rounded-b"></div>
        <div className="absolute bottom-4 w-[70px] left-[-5px] h-6 bg-[#3A4B29] rounded-b"></div>

        {/* TARIFF text on top pipe - centered vertically */}
        <div className="absolute inset-0 flex flex-col justify-center items-center">
          <div className="flex flex-col items-center justify-center h-full">
            {["T", "A", "R", "I", "F", "F"].map((letter, index) => (
              <div 
                key={index}
                className="text-white font-bold my-[-2px]"
                style={{
                  textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                  fontFamily: '"Press Start 2P", "Courier New", monospace',
                  fontSize: '12px',
                  transform: 'rotate(-3deg)'
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Bottom pipe */}
      <div
        className="pipe"
        style={{
          left: `${x}px`,
          top: `${height + pipeGap}px`,
          width: `${pipeWidth}px`,
          height: `${gameHeight - height - pipeGap}px`,
          borderTopLeftRadius: '5px',
          borderTopRightRadius: '5px',
          backgroundColor: '#506C37', // Darker green
          boxShadow: 'inset 0 0 10px rgba(0,0,0,0.5)',
          position: 'absolute',
          border: '1px solid #3A4B29',
        }}
      >
        <div className="absolute top-0 w-full h-4 bg-[#3A4B29] rounded-t"></div>
        <div className="absolute top-4 w-[70px] left-[-5px] h-6 bg-[#3A4B29] rounded-t"></div>

        {/* TARIFF text on bottom pipe - reversed to read from top to bottom */}
        <div className="absolute inset-x-0 top-10 bottom-0 flex flex-col justify-start items-center">
          <div className="flex flex-col items-center justify-start mt-4">
            {["T", "A", "R", "I", "F", "F"].map((letter, index) => (
              <div 
                key={index}
                className="text-white font-bold my-[-2px]"
                style={{
                  textShadow: '1px 1px 0 #000, -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000',
                  fontFamily: '"Press Start 2P", "Courier New", monospace',
                  fontSize: '12px',
                  transform: 'rotate(3deg)'
                }}
              >
                {letter}
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Pipe;

'use client';

interface SubstackEmbedProps {
  className?: string;
  width?: string | number;
  height?: string | number;
}

export default function SubstackEmbed({ 
  className = "", 
  width = 480, 
  height = 320 
}: SubstackEmbedProps) {
  const isResponsive = width === "100%";
  
  return (
    <div className={`flex justify-center items-center ${className}`}>
      {isResponsive ? (
        <div className="w-full max-w-lg">
          <iframe 
            src="https://mrtreeshop.substack.com/embed" 
            width="100%"
            height={height}
            style={{
              border: '1px solid #EEE',
              background: 'white',
              borderRadius: '8px',
              minWidth: '300px'
            }}
            frameBorder="0"
            scrolling="no"
            title="Subscribe to TreeShop Newsletter"
            className="shadow-lg w-full"
          />
        </div>
      ) : (
        <iframe 
          src="https://mrtreeshop.substack.com/embed" 
          width={width}
          height={height}
          style={{
            border: '1px solid #EEE',
            background: 'white',
            borderRadius: '8px',
            maxWidth: '100%'
          }}
          frameBorder="0"
          scrolling="no"
          title="Subscribe to TreeShop Newsletter"
          className="shadow-lg"
        />
      )}
    </div>
  );
}
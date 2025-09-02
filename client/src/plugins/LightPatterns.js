// Light Patterns Plugin
// This is a reference implementation of how plugins can extend functionality

export const LightPatternsPlugin = {
  name: 'LightPatterns',
  version: '1.0.0',
  description: 'Advanced light pattern generation with custom algorithms',
  category: 'visualization',
  
  patterns: {
    // Custom pattern algorithms
    fibonacci: {
      name: 'Fibonacci Spiral',
      description: 'Light pattern following Fibonacci spiral',
      generate: (ctx, width, height, time, params) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const maxRadius = Math.min(width, height) / 2;
        
        ctx.beginPath();
        for (let i = 0; i < 100; i++) {
          const angle = (i / 100) * Math.PI * 4 + time * params.speed;
          const radius = (i / 100) * maxRadius * params.intensity;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          if (i === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    },
    
    chakra: {
      name: 'Chakra Alignment',
      description: 'Seven-point chakra alignment pattern',
      generate: (ctx, width, height, time, params) => {
        const centerX = width / 2;
        const centerY = height / 2;
        const colors = [
          '#ff0000', '#ff8c00', '#ffff00', '#00ff00', 
          '#00ffff', '#0000ff', '#800080'
        ];
        
        for (let i = 0; i < 7; i++) {
          const angle = (i / 7) * Math.PI * 2 + time * params.speed;
          const radius = 50 + Math.sin(time * 2 + i) * 20;
          const x = centerX + Math.cos(angle) * radius;
          const y = centerY + Math.sin(angle) * radius;
          
          ctx.fillStyle = colors[i];
          ctx.beginPath();
          ctx.arc(x, y, 15, 0, Math.PI * 2);
          ctx.fill();
        }
      }
    },
    
    binaural: {
      name: 'Binaural Visualization',
      description: 'Visual representation of binaural beats',
      generate: (ctx, width, height, time, params) => {
        const leftFreq = params.leftFreq || 200;
        const rightFreq = params.rightFreq || 210;
        const beatFreq = Math.abs(leftFreq - rightFreq);
        
        // Left channel
        ctx.fillStyle = 'rgba(255, 0, 0, 0.5)';
        for (let x = 0; x < width / 2; x += 2) {
          const y = height / 2 + Math.sin((x / width) * leftFreq * 0.1 + time) * 50;
          ctx.fillRect(x, y, 2, 2);
        }
        
        // Right channel
        ctx.fillStyle = 'rgba(0, 0, 255, 0.5)';
        for (let x = width / 2; x < width; x += 2) {
          const y = height / 2 + Math.sin((x / width) * rightFreq * 0.1 + time) * 50;
          ctx.fillRect(x, y, 2, 2);
        }
        
        // Beat frequency overlay
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let x = 0; x < width; x += 2) {
          const y = height / 2 + Math.sin((x / width) * beatFreq * 0.1 + time) * 30;
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }
    }
  },
  
  initialize: async () => {
    console.log('LightPatterns plugin initialized with custom patterns');
    return true;
  },
  
  getPattern: (name) => {
    return this.patterns[name];
  },
  
  getAllPatterns: () => {
    return Object.keys(this.patterns);
  }
};

export default LightPatternsPlugin;
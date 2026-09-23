module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      colors: {
        sand: '#f3efe9',
        blush: '#e9d7d0',
        stone: '#4a443d',
        gold: '#a8865b',
        ink: '#1d1a19'
      },
      boxShadow: {
        soft: '0 16px 40px rgba(29,26,25,0.08)'
      }
    }
  },
  plugins: []
};

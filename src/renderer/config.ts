export type ConfigType = {
  header: {
    position: 'left' | 'center' | 'right';
  };
  footer: {
    position: 'left' | 'center' | 'right';
  };
};

const config: ConfigType = {
  header: {
    position: 'center',
  },
  footer: {
    position: 'right',
  },
};

export default config;

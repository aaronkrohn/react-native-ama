const path = require('path');
const blacklist = require('metro-config/src/defaults/exclusionList');
const escape = require('escape-string-regexp');
const pak = require('../../package.json');
const myPackage = require('./package.json');

const root = path.resolve(__dirname, '../..');
const parent = path.resolve(__dirname, '..');

const modules = Object.keys({
  ...pak.peerDependencies,
});

/**
 * Need to tell metro where to find all the dependencies, otherwise is going to look into
 * the "../../node_modules" starting from the parent folder
 */
const allModules = [
    ...Object.keys({
        ...pak.peerDependencies,
    }),
    ...Object.keys({
        ...myPackage.devDependencies
    })
];

module.exports = {
  projectRoot: __dirname,
  watchFolders: [root, parent],

  // We need to make sure that only one version is loaded for peerDependencies
  // So we blacklist them at the root, and alias them to the versions in example's node_modules
  resolver: {
    blacklistRE: blacklist(
      modules.map(
        (m) =>
          new RegExp(`^${escape(path.join(root, 'node_modules', m))}\\/.*$`)
      )
    ),

  extraNodeModules: allModules.reduce((acc, name) => {
      acc[name] = path.join(__dirname, 'node_modules', name);

      return acc;
    }, {}),
  },

  transformer: {
    getTransformOptions: async () => ({
      transform: {
        experimentalImportSupport: false,
        inlineRequires: true,
      },
    }),
  },
};

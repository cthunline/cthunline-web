const fixedMinorDependencies = [
    '@types/react',
    '@types/react-dom',
    'react',
    'react-dom'
];

module.exports = {
    upgrade: true,
    target: (dependencyName) => {
        return fixedMinorDependencies.includes(dependencyName)
            ? 'minor'
            : 'latest';
    }
};

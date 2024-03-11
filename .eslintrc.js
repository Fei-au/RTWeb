module.exports = {
    // eslint-config-react-app
    extends: ['react-app'], // extends official
    parserOptions: {
        babelOptions: {
            // deal with web page error, when eslint checking jsx syntax, it won't give error alert
            presets: [
                ['babel-preset-react-app', false],
                'babel-preset-react-app/prod',
            ],
        }
    },
    rules: {
        "no-unused-vars": "off",
        "eslint-disable-next-line":"off",
        "no-undef":"off",
        "no-debugger":"off",
        "no-unreachable": "off",
        "react-hooks/exhaustive-deps": "off"
      }
}
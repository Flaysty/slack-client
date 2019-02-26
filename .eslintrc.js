module.exports = {
    "extends": "airbnb",
    "parser": "babel-eslint",
    "plugins": ['react', 'jsx-a11y', 'import'],
    "rules": {
      "react/jsx-filename-extension": 0,
      "react/destructuring-assignment": 0,
      "react/prop-types": 0,
      "object-curly-newline": 0,
      "implicit-arrow-linebreak": 0,
      "import/prefer-default-export": 0,
    },
    "globals": {
      "document": 1,
      "localStorage": 1,
      "ENTER_KEY": 1,
    },
    "env": {
      "browser": 1,
    }
};

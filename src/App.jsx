import MyEditor from "./components/Editor";
import './App.css';
import React, { useState } from "react";



const App = () => {
  
  // return <DemoEditor />;
  const [isDarkMode, setIsDarkMode] = useState(false);

  const handleDarkModeChange = () => {
    const body = document.body;
    setIsDarkMode(!isDarkMode);

    if (!isDarkMode) {
      body.classList.add("dark-mode");
    } else {
      body.classList.remove("dark-mode");
    }
  }

  return (
    <div>
      <div className={`dark-mode-toggle ${isDarkMode ? 'dark' : 'light'}`} onClick={handleDarkModeChange}>
        <label>
          <input
            type="radio"
            name="darkModeToggle"
            checked={isDarkMode}
            onChange={() => {}} // Disable default behavior of radio button
          />
          <span className={isDarkMode ? 'dark-text' : 'light-text'}>
            {isDarkMode ? "Turn Light Mode" : "Turn Dark Mode"}
          </span>
        </label>
      </div>
      <MyEditor />
    </div>
  );


};

export default App;

import React, { useRef, useState, useEffect, useCallback } from 'react';
import { TbList } from "react-icons/tb";
import { TbListNumbers } from "react-icons/tb";
import { LuUndo2 } from "react-icons/lu";
import { LuRedo2 } from "react-icons/lu";

const TextEditor = ({setContent}) => {
  const editorRef = useRef(null);
  const [history, setHistory] = useState(['']);
  const [historyIndex, setHistoryIndex] = useState(0);
  const [activeCommands, setActiveCommands] = useState({
    bold: false,
    italic: false,
    underline: false,
    unorderedList: false,
    orderedList: false,
  });

  useEffect(() => {
    setContent(history[historyIndex])
  }, [historyIndex])

  const debounceTimer = useRef(null);

  const updateActiveCommands = useCallback(() => {
    if (!document.queryCommandSupported) return;
    setActiveCommands({
      bold: document.queryCommandState('bold'),
      italic: document.queryCommandState('italic'),
      underline: document.queryCommandState('underline'),
      unorderedList: document.queryCommandState('insertUnorderedList'),
      orderedList: document.queryCommandState('insertOrderedList'),
    });
  }, []);

  const saveToHistory = useCallback(() => {
    if (!editorRef.current) return;
    const newContent = editorRef.current.innerHTML;
    
    setHistory(prev => {
      if (prev[historyIndex] === newContent) return prev;
      const newHistory = [...prev.slice(0, historyIndex + 1), newContent];
      setHistoryIndex(newHistory.length - 1);
      return newHistory;
    });
  }, [historyIndex]);

  const handleInput = useCallback(() => {
    updateActiveCommands();
    if (debounceTimer.current) clearTimeout(debounceTimer.current);
    debounceTimer.current = setTimeout(saveToHistory, 500);
  }, [saveToHistory, updateActiveCommands]);

  const executeCommand = useCallback((command, value = null) => {
    document.execCommand(command, false, value);
    handleInput();
    editorRef.current?.focus();
  }, [handleInput]);

  const handleUndo = useCallback(() => {
    if (historyIndex > 0) {
      setHistoryIndex(prev => prev - 1);
      editorRef.current.innerHTML = history[historyIndex - 1];
      updateActiveCommands();
    }
  }, [history, historyIndex, updateActiveCommands]);

  const handleRedo = useCallback(() => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(prev => prev + 1);
      editorRef.current.innerHTML = history[historyIndex + 1];
      updateActiveCommands();
    }
  }, [history, historyIndex, updateActiveCommands]);

  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    const handleEvents = () => {
      updateActiveCommands();
      if (debounceTimer.current) clearTimeout(debounceTimer.current);
      debounceTimer.current = setTimeout(saveToHistory, 500);
    };

    editor.addEventListener('input', handleEvents);
    editor.addEventListener('mouseup', updateActiveCommands);
    editor.addEventListener('keyup', updateActiveCommands);

    return () => {
      editor.removeEventListener('input', handleEvents);
      editor.removeEventListener('mouseup', updateActiveCommands);
      editor.removeEventListener('keyup', updateActiveCommands);
    };
  }, [saveToHistory, updateActiveCommands]);

  return (
    <div className="dark">
      <div className="w-full font-inter flex flex-col rounded-lg">
        <div className="w-full flex flex-wrap gap-2 bg-gray-800 border border-richblack-600 p-2">
          <button
            type="button"
            onClick={() => executeCommand('bold')}
            className={`h-10 w-10 rounded ${
              activeCommands.bold ? 'bg-gray-600 text-yellow-200' : 'bg-gray-700 dark:text-white'
            } hover:bg-gray-600`}
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('italic')}
            className={`h-10 w-10 rounded ${
              activeCommands.italic ? 'bg-gray-600 text-yellow-200' : 'bg-gray-700 dark:text-white'
            } hover:bg-gray-600`}
          >
            <em>I</em>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('underline')}
            className={`h-10 w-10 rounded ${
              activeCommands.underline ? 'bg-gray-600 text-yellow-200' : 'bg-gray-700 dark:text-white'
            } hover:bg-gray-600 `}
          >
            U
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertUnorderedList')}
            className={`h-10 rounded px-4 ${
              activeCommands.unorderedList ? 'bg-gray-600 text-yellow-200' : 'bg-gray-700 dark:text-white'
            } hover:bg-gray-600 dark:text-white`}
          >
            <TbList/>
          </button>
          <button
            type="button"
            onClick={() => executeCommand('insertOrderedList')}
            className={`h-10 rounded px-4 ${
              activeCommands.orderedList ? 'bg-gray-600 text-yellow-200' : 'bg-gray-700 dark:text-white'
            } hover:bg-gray-600 dark:text-white`}
          >
            <TbListNumbers/>
          </button>
          <button
            type="button"
            onClick={handleUndo}
            disabled={historyIndex === 0}
            className={`h-10 rounded px-4 ${
              historyIndex > 0 ? 'bg-gray-700 hover:bg-gray-600 text-yellow-200' : 'bg-gray-800 cursor-not-allowed dark:text-white'
            }`}
          >
            <LuUndo2/>
          </button>
          <button
            type="button"
            onClick={handleRedo}
            disabled={historyIndex === history.length - 1}
            className={`h-10 rounded px-4 ${
              historyIndex < history.length - 1 ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 cursor-not-allowed'
            } dark:text-white`}
          >
            <LuRedo2/>
          </button>
        </div>

        <div
          ref={editorRef}
          className="w-full min-h-[150px] bg-gray-800 p-4 text-white border-x border-b border-richblack-600 outline-none"
          contentEditable
          onInput={handleInput}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              executeCommand('insertParagraph');
            }
          }}
        />
      </div>
    </div>
  );
};

export default TextEditor;
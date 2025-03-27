import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-python";
import "ace-builds/src-noconflict/mode-javascript";
import "ace-builds/src-noconflict/theme-monokai";
import "../Styles/QuestionPage.css";

const QuestionPage = () => {
    const { id } = useParams();
    const [question, setQuestion] = useState(null);
    const [code, setCode] = useState("");
    const [language, setLanguage] = useState("python");
    const [output, setOutput] = useState("Click 'Run Code' to see the output...");
    const [aiReport, setAiReport] = useState("AI report will be displayed here...");
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        axios.get(`http://localhost:5000/questions/${id}`)
            .then((response) => {
                setQuestion(response.data.question);
                setCode(response.data.question.function_templates[language]);
            })
            .catch((error) => {
                console.error("Error fetching question:", error);
            });
    }, [id, language]);

    const handleLanguageChange = (e) => {
        setLanguage(e.target.value);
        setCode(question.function_templates[e.target.value]);
    };

    const runCode = async () => {
        if (!question) {
            console.log("❌ No question data available.");
            return;
        }

        setIsLoading(true);
        setOutput("Running code...");
        setAiReport("AI feedback pending...");

        try {
            const response = await axios.post("http://localhost:5000/api/execute", {
                script: code,
                language: language === "python" ? "python3" : "nodejs",
            });

            if (!response.data || !response.data.output) {
                setOutput("Error: No output received.");
                setIsLoading(false);
                return;
            }

            let actualOutputs = response.data.output.trim().split("\n");

            if (!question.test_cases || question.test_cases.length === 0) {
                setOutput("Error: No test cases found.");
                setIsLoading(false);
                return;
            }

            const results = question.test_cases.map((test, index) => ({
                input: test.input,
                expected_output: JSON.stringify(test.expected_output),
                actual_output: JSON.stringify(actualOutputs[index] || ""),
                passed: JSON.stringify(actualOutputs[index]) === JSON.stringify(test.expected_output)
            }));

            const formattedOutput = results.map((test, index) => ({
                content: `Test Case ${index + 1}: ${test.passed ? "PASSED" : "FAILED"}
Input: ${test.input}
Expected Output: ${test.expected_output}
Actual Output: ${test.actual_output}`,
                passed: test.passed
            }));

            setOutput(formattedOutput);
        } catch (error) {
            setOutput([{
                content: "Error executing code.",
                passed: false
            }]);
        } finally {
            setIsLoading(false);
        }
    };

    const submitForReview = async () => {
        setIsLoading(true);
        setAiReport("AI is analyzing your code...");

        try {
            const aiResponse = await axios.post("http://localhost:5000/ai/generate_feedback", {
                script: code,
                language: language,
            });

            setAiReport(aiResponse.data.feedback || "AI feedback not available.");
        } catch (error) {
            setAiReport("Error generating AI feedback.");
        } finally {
            setIsLoading(false);
        }
    };

    const renderTestCases = () => {
        if (!question) return null;
        
        return (
            <div className="test-cases-container">
                <h3>Sample Test Cases</h3>
                {question.test_cases.map((test, index) => (
                    <div key={index} className="test-case">
                        <div className="test-case-header">
                            <span className="test-case-number">Test Case {index + 1}</span>
                        </div>
                        <div className="test-case-content">
                            <div className="input-output">
                                <div>
                                    <label>Input</label>
                                    <pre>{JSON.stringify(test.input)}</pre>
                                </div>
                                <div>
                                    <label>Expected Output</label>
                                    <pre>{JSON.stringify(test.expected_output)}</pre>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    const renderOutput = () => {
        if (typeof output === 'string') {
            return <pre>{output}</pre>;
        }

        return output.map((item, index) => (
            <pre 
                key={index} 
                className={`output-test-case ${item.passed ? 'passed' : 'failed'}`}
            >
                {item.content}
            </pre>
        ));
    };

    return (
        <div className="coding-platform">
            {/* Header */}
            <header className="platform-header">
                <div className="header-left">
                    <h1>Crack-wise</h1>
                    <div className="challenge-info">
                        <span className="difficulty-badge medium">Medium</span>
                    </div>
                </div>
                <div className="header-right">
                    <div className="language-selector">
                        <label>Language:</label>
                        <select value={language} onChange={handleLanguageChange}>
                            <option value="python">Python</option>
                            <option value="javascript">JavaScript</option>
                        </select>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <div className="main-content">
                {/* Problem Section */}
                <div className="problem-section">
                    <div className="problem-content">
                        {question && (
                            <>
                                <h2 className="problem-title">{question.title}</h2>
                                <div className="problem-description">
                                    <p>{question.description}</p>
                                </div>
                                {renderTestCases()}
                            </>
                        )}
                    </div>
                </div>

                {/* Editor Section */}
                <div className="editor-section">
                    <div className="editor-header">
                        <h3>Code Editor</h3>
                        <div className="editor-actions">
                            <button 
                                className="run-button"
                                onClick={runCode}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Running...' : 'Run Code'}
                            </button>
                            <button 
                                className="submit-button"
                                onClick={submitForReview}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Processing...' : 'AI Review'}
                            </button>
                        </div>
                    </div>

                    <AceEditor
                        mode={language}
                        theme="monokai"
                        fontSize={14}
                        value={code}
                        onChange={(newCode) => setCode(newCode)}
                        width="100%"
                        height="400px"
                        showPrintMargin={false}
                        setOptions={{ 
                            useWorker: false,
                            enableBasicAutocompletion: true,
                            enableLiveAutocompletion: true,
                            enableSnippets: true
                        }}
                        editorProps={{ $blockScrolling: true }}
                    />

                    <div className="output-container">
                        <div className="output-content">
                            {renderOutput()}
                        </div>
                    </div>
                </div>

                {/* AI Report Section */}
                <div className="ai-section">
                    <div className="ai-header">
                        <h3>AI Code Review</h3>
                    </div>
                    <div className="ai-content">
                        <div className="ai-feedback">
                            <p>{aiReport}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default QuestionPage;
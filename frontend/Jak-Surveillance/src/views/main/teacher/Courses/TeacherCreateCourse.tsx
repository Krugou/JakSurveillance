import React, { useState } from 'react';

const TeacherCreateCourse: React.FC = () => {
    const [courseName, setCourseName] = useState('');
    const [file, setFile] = useState<File | null>(null);
    const [courseTopics, setCourseTopics] = useState<string[]>([]);
    const [customTopics, setCustomTopics] = useState<string[]>(['']);

    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFile(event.target.files ? event.target.files[0] : null);
    };

    const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const selectedTopics = Array.from(e.target.selectedOptions, option => option.value);
        setCourseTopics(selectedTopics);
    };

    const addCustomTopic = () => {
        setCustomTopics(prevTopics => [...prevTopics, '']);
    };

    const handleCustomTopicChange = (index: number, value: string) => {
        const newTopics = [...customTopics];
        newTopics[index] = value;
        setCustomTopics(newTopics);
    };

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Here you can handle the course creation logic
        console.log(`Course Created: ${courseName}`);
        if (file) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('courseName', courseName);

            const response = await fetch('http://your-backend-url.com/upload', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                console.log('File uploaded successfully');
            } else {
                console.error('File upload failed');
            }
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h1 className="text-4xl font-bold mb-8 text-blue-600">Create Course</h1>
            <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white p-6 rounded shadow-md">
                <input
                    type="text"
                    placeholder="Course Name"
                    value={courseName}
                    onChange={(e) => setCourseName(e.target.value)}
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                />
                <select
                    multiple
                    value={courseTopics}
                    onChange={handleTopicChange}
                    className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    <option value="math">Math</option>
                    <option value="physics">Physics</option>
                    {/* Add more options as needed */}
                </select>
                {customTopics.map((topic, index) => (
                    <input
                        key={index}
                        type="text"
                        placeholder="Custom Topic"
                        value={topic}
                        onChange={(e) => handleCustomTopicChange(index, e.target.value)}
                        className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-600"
                    />
                ))}
                <button
                    type="button"
                    onClick={addCustomTopic}
                    className="mb-3 w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                >
                    Add Custom Topic
                </button>
                <button
                    type="submit"
                    className="w-full p-2 bg-blue-500 text-white font-bold rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600"
                >
                    Create Course
                </button>
            </form>
        </div>
    );
};

export default TeacherCreateCourse;
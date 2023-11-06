import React, {useEffect, useState} from 'react';
import apiHooks from '../../../../../hooks/ApiHooks';

const TopicGroupAndTopicsSelector: React.FC = () => {
	const [topicData, setTopicData] = useState<any>([]);
	const [courseTopicGroup, setCourseTopicGroup] = useState('');
	const [selectedGroupTopics, setSelectedGroupTopics] = useState([]);
	const [courseTopics, setCourseTopics] = useState<string[]>([]);
	const [customTopics, setCustomTopics] = useState<string[]>(['']);

	const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedTopics = Array.from(
			e.target.selectedOptions,
			option => option.value,
		);
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

	useEffect(() => {
		apiHooks.getAllTopicGroupsAndTopicsInsideThem().then(data => {
			setTopicData(data);
			if (data.length > 0) {
				setCourseTopicGroup(data[0].topicgroupname);
			}
		});
	}, []);

	useEffect(() => {
		const selectedGroup = topicData.find(
			group => group.topicgroupname === courseTopicGroup,
		);
		setSelectedGroupTopics(
			selectedGroup ? selectedGroup.topics.split(',') : [],
		);
	}, [courseTopicGroup, topicData]);

	return (
		<fieldset>
			<legend>Topic Details</legend>
			<select
				title="Select Course Topic Group"
				value={courseTopicGroup}
				onChange={e => setCourseTopicGroup(e.target.value)}
				className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
			>
				{topicData.map((group, index) => (
					<option key={index} value={group.topicgroupname}>
						{group.topicgroupname}
					</option>
				))}
			</select>
			<select
				title="Select Course Topics"
				multiple
				value={courseTopics}
				onChange={handleTopicChange}
				className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
			>
				{selectedGroupTopics.map((topic, index) => (
					<option key={index} value={topic}>
						{topic}
					</option>
				))}
			</select>
			{customTopics.map((topic, index) => (
				<input
					key={index}
					type="text"
					placeholder="Custom Topic"
					value={topic}
					onChange={e => handleCustomTopicChange(index, e.target.value)}
					className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
					title='add custom topics here example: "exam"'
				/>
			))}
			<button
				type="button"
				onClick={addCustomTopic}
				className="mb-3 w-full p-2 bg-metropoliaMainOrange text-white rounded hover:bg-metropoliaSecondaryOrange"
			>
				Add Custom Topic
			</button>
		</fieldset>
	);
};

export default TopicGroupAndTopicsSelector;

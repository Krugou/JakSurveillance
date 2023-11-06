import React, {useEffect, useState} from 'react';
import apiHooks from '../../../../hooks/ApiHooks';

interface Props {
	topicsFormData: any;
	setTopicsFormData: React.Dispatch<React.SetStateAction<any>>;
}

const TopicGroupAndTopicsSelector: React.FC<Props> = ({
	topicsFormData,
	setTopicsFormData,
}) => {
	const [topicData, setTopicData] = useState<any>([]);
	const [courseTopicGroup, setCourseTopicGroup] = useState('');
	const [selectedGroupTopics, setSelectedGroupTopics] = useState([]);
	const [courseTopics, setCourseTopics] = useState<string[]>([]);
	const [customTopics, setCustomTopics] = useState<string[]>(['']);
	const [customTopicGroup, setCustomTopicGroup] = useState('');
	const [customTopic, setCustomTopic] = useState('');
	const [isCustomGroup, setIsCustomGroup] = useState(false);
	const handleTopicChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const selectedTopics = Array.from(
			e.target.selectedOptions,
			option => option.value,
		);
		setCourseTopics(selectedTopics);

		let topicGroup = '';
		let topics = '';
		if (isCustomGroup) {
			topicGroup = customTopicGroup;
			topics = JSON.stringify(customTopics);
		} else {
			topicGroup = courseTopicGroup;
			topics = JSON.stringify(selectedTopics);
		}

		setTopicsFormData(prevFormData => ({
			...prevFormData,
			topicgroup: topicGroup,
			topics: topics,
		}));
	};
	// useEffect(() => {
	// 	console.log(topicsFormData);
	// }, [isCustomGroup, topicsFormData]);

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
		const selectedTopics = selectedGroup ? selectedGroup.topics.split(',') : [];
		setSelectedGroupTopics(selectedTopics);

		let topicGroup = '';
		let topics = '';
		if (isCustomGroup) {
			topicGroup = customTopicGroup;
			topics = JSON.stringify(customTopics);
		} else {
			topicGroup = courseTopicGroup;
			topics = JSON.stringify(selectedTopics);
		}

		setTopicsFormData(prevFormData => ({
			...prevFormData,
			topicgroup: topicGroup,
			topics: topics,
		}));
	}, [
		courseTopicGroup,
		isCustomGroup,
		customTopicGroup,
		customTopics,
		topicData,
	]);

	return (
		<fieldset>
			<div className="flex justify-between ">
				<h2>Topic Details</h2>
				<button
					type="button"
					onClick={() => setIsCustomGroup(prev => !prev)}
					className="mb-3 w-1/2 p-2 bg-metropoliaMainOrange text-white rounded hover:bg-metropoliaSecondaryOrange"
				>
					{isCustomGroup ? 'Select Existing Group' : 'Create Custom Group'}
				</button>
			</div>

			{isCustomGroup ? (
				<>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<div>
							<label
								htmlFor="customTopicGroup"
								className="block font-medium mb-1"
							>
								Custom Topic Group
							</label>
							<input
								id="customTopicGroup"
								type="text"
								placeholder="Custom Topic Group"
								value={customTopicGroup}
								onChange={e => setCustomTopicGroup(e.target.value)}
								className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange"
								title='add custom topic group here example: "customGroup"'
							/>
						</div>
						<div>
							<label htmlFor="customTopics" className="block font-medium mb-1">
								Custom Topics
							</label>
							{customTopics.map((topic, index) => (
								<div key={index} className="flex items-center">
									<input
										id={`customTopics-${index}`}
										type="text"
										placeholder="Custom Topic"
										value={topic}
										onChange={e =>
											handleCustomTopicChange(index, e.target.value)
										}
										className="w-full mb-3 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-metropoliaMainOrange mr-2"
										title='add custom topics here example: "exam"'
									/>
									{customTopics.length > 1 && (
										<button
											type="button"
											onClick={() => {
												setCustomTopics(prevTopics =>
													prevTopics.filter((_, i) => i !== index),
												);
											}}
											className="p-2 bg-red-500 text-white rounded hover:bg-red-600"
											title="Remove custom topic"
										>
											<svg
												xmlns="http://www.w3.org/2000/svg"
												viewBox="0 0 20 20"
												fill="currentColor"
												className="w-4 h-4"
											>
												<path
													fillRule="evenodd"
													d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L10 8.586l-2.293-2.293a1 1 0 00-1.414 1.414L8.586 10l-2.293 2.293a1 1 0 001.414 1.414L10 11.414l2.293 2.293a1 1 0 001.414-1.414L11.414 10l2.293-2.293z"
													clipRule="evenodd"
												/>
											</svg>
										</button>
									)}
								</div>
							))}
							<button
								type="button"
								onClick={() => {
									setCustomTopics(prevTopics => [...prevTopics, customTopic]);
									setCustomTopic('');
								}}
								className="mb-3 w-full p-2 bg-metropoliaMainOrange text-white rounded hover:bg-metropoliaSecondaryOrange"
							>
								Add Custom Topic
							</button>
						</div>
					</div>
				</>
			) : (
				// Form fields for selecting an existing group
				<>
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
				</>
			)}
		</fieldset>
	);
};

export default TopicGroupAndTopicsSelector;

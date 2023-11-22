import React, {useEffect, useState} from 'react';

const WelcomeModal = () => {
	const [showModal, setShowModal] = useState(false);

	useEffect(() => {
		const firstVisit = localStorage.getItem('firstVisit');
		if (!firstVisit) {
			setShowModal(true);
			localStorage.setItem('firstVisit', 'no');
		}
	}, []);

	return (
		showModal && (
			<div className="fixed bottom-0 right-0 m-6 z-50 bg-white rounded-lg p-6 shadow-lg max-w-xs sm:max-w-md md:max-w-lg lg:max-w-xl">
				<div>
					<h2 className="text-2xl font-bold mb-2">Welcome JakSurveillance! its your first time here</h2>
					<p className="mb-4">
						If you ever find yourself unsure of what to do, head over to our
						Instruction Videos section. There, you'll find comprehensive guides to
						help you make the most of JakSurveillance.
					</p>
					<button
						className="bg-blue-500 text-white rounded px-4 py-2"
						onClick={() => setShowModal(false)}
					>
						Close
					</button>
				</div>
			</div>
		)
	);
};

export default WelcomeModal;

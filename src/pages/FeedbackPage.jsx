import React, { useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { addFeedback } from '../services/ResponseService';
import { FaCheckCircle, FaTimesCircle, FaExclamationCircle, FaSpinner } from 'react-icons/fa';

const questions = [
	{ id: 1, sectionId: 1, qn: "Course is relevant for the programme" },
	{ id: 2, sectionId: 1, qn: "Course content is adequate in relation to the Course Outcomes (COs)" },
	{ id: 3, sectionId: 1, qn: "Allocation of the credits to the course is appropriate" },
	{ id: 4, sectionId: 1, qn: "Units/sections in the syllabus are properly sequenced" },
	{ id: 5, sectionId: 1, qn: "Course Reference Books are adequate" },

	{ id: 6, sectionId: 2, qn: "Teacher speaks clearly and audibly" },
	{ id: 7, sectionId: 2, qn: "Teacher provides examples of concept/principles. Explanations are clear and effective" },
	{ id: 8, sectionId: 2, qn: "Teacher writes and draws legibly" },
	{ id: 9, sectionId: 2, qn: "Teacher's pace and level of instructions are suited to the needs of students" },
	{ id: 10, sectionId: 2, qn: "Teacher offers assistance and counselling to the needy students" },

	{ id: 11, sectionId: 3, qn: "Teacher asks questions to promote interactions and refractive thinking" },
	{ id: 12, sectionId: 3, qn: "Teacher encourages questioning/raising doubts by students and answers them well" },
	{ id: 13, sectionId: 3, qn: "Course improved my ability to formulate, analyze and solve problems" },
	{ id: 14, sectionId: 3, qn: "Teacher encourages, compliments and praises originality and creativity displayed by the student" },
	{ id: 15, sectionId: 3, qn: "Teacher is courteous and impartial in dealing with the student" },

	{ id: 16, sectionId: 4, qn: "Teacher engages class regularly and maintains discipline" },
	{ id: 17, sectionId: 4, qn: "Course enabled understanding of the concepts in relating theory to practice" },
	{ id: 18, sectionId: 4, qn: "Course is intellectually stimulating" },
	{ id: 19, sectionId: 4, qn: "Teacher's marking of scripts is fair and impartial" },
	{ id: 20, sectionId: 4, qn: "Course evaluation scheme is designed well" }
];

const options = [
	{ option: "Strongly Agree", value: 5, color: "success" },
	{ option: "Agree", value: 4, color: "info" },
	{ option: "Neutral", value: 3, color: "warning" },
	{ option: "Disagree", value: 2, color: "danger" },
	{ option: "Strongly Disagree", value: 1, color: "danger" }
];

const sections = [
	{ id: 1, value: "PLANNING AND ORGANIZATION", icon: "📋" },
	{ id: 2, value: "PRESENTATION / COMMUNICATION", icon: "🎯" },
	{ id: 3, value: "STUDENT'S PARTICIPATION", icon: "👥" },
	{ id: 4, value: "CLASS MANAGEMENT / ASSESSMENT OF STUDENTS", icon: "📊" }
];

const FeedbackPage = () => {
	const [responses, setResponses] = useState({});
	const { courseId, courseCode, courseName } = useParams();
	const [missingValues, setMissingValues] = useState([]);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [showConfirmDialog, setShowConfirmDialog] = useState(false);
	const studentId = localStorage.getItem("currentUser");
	const navigate = useNavigate();

	const handleSelection = (questionId, value) => {
		setResponses((prev) => ({
			...prev,
			[questionId]: value,
		}));
	};

	const handleSubmit = (e) => {
		e.preventDefault();
		if (validateForm()) {
			setShowConfirmDialog(true);
		}
	};

	const handleConfirmSubmit = async () => {
		setIsSubmitting(true);
		try {
			await addFeedback(courseId, studentId, responses);
			navigate('/student');
		} catch (error) {
			console.error('Error submitting feedback:', error);
			setIsSubmitting(false);
		}
	};

	function validateForm() {
		let missingValuesCopy = [];
		let isValid = true;

		questions.forEach((question) => {
			let qnId = `qn${question.id}`;
			if (!Object.keys(responses).includes(qnId)) {
				missingValuesCopy.push(qnId);
				isValid = false;
			}
		});

		setMissingValues([...missingValuesCopy]);
		return isValid;
	}

	const progress = (Object.keys(responses).length / questions.length) * 100;

	return (
		<div className="min-vh-100 bg-light">
			{/* Header */}
			<div className="bg-primary text-white py-4 shadow-sm sticky-top">
				<div className="container">
					<h2 className="text-center mb-0">{courseCode} - {courseName}</h2>
				</div>
			</div>

			{/* Progress Bar */}
			<div className="container mt-4">
				<div className="progress rounded-pill" style={{ height: '10px' }}>
					<div 
						className="progress-bar bg-success" 
						role="progressbar" 
						style={{ width: `${progress}%` }}
						aria-valuenow={progress} 
						aria-valuemin="0" 
						aria-valuemax="100"
					></div>
				</div>
				<div className="text-center mt-2 text-muted">
					{Object.keys(responses).length} of {questions.length} questions answered
				</div>
			</div>

			{/* Main Content */}
			<div className="container py-4">
				<div className="row">
					<div className="col-lg-8 mx-auto">
						<form className='mb-5'>
							{sections.map((section) => (
								<div key={section.id} className="mb-5">
									<div className="d-flex align-items-center mb-4 section-header">
										<span className="fs-1 me-3">{section.icon}</span>
										<h4 className="mb-0 text-primary">{section.value}</h4>
									</div>
									<div className="section-questions">
										{questions
											.filter((question) => question.sectionId === section.id)
											.map((question) => (
												<div 
													key={question.id}
													className={`card mb-4 border-0 shadow-sm hover-shadow transition ${
														missingValues.includes(`qn${question.id}`) 
															? 'border-danger' 
															: 'border-light'
													}`}
												>
													<div className="card-body p-4">
														<div className="d-flex align-items-start mb-4">
															<span className="badge bg-primary rounded-pill me-3 px-3 py-2">
																{question.id}
															</span>
															<h6 className="card-title mb-0 flex-grow-1">
																{question.qn}
															</h6>
														</div>
														
														<div className="options-grid">
															{options.map((option) => (
																<div
																	key={option.value}
																	className={`option-item ${
																		responses[`qn${question.id}`] === option.value 
																			? 'selected' 
																			: ''
																	}`}
																	onClick={() => handleSelection(`qn${question.id}`, option.value)}
																>
																	<input
																		type="radio"
																		className="form-check-input"
																		name={`qn${question.id}`}
																		value={option.value}
																		checked={responses[`qn${question.id}`] === option.value}
																		onChange={() => {}}
																	/>
																	<label className="form-check-label">
																		{option.option}
																	</label>
																</div>
															))}
														</div>

														{missingValues.includes(`qn${question.id}`) && (
															<div className="text-danger mt-3 d-flex align-items-center">
																<FaExclamationCircle className="me-2" />
																Please select an option
															</div>
														)}
													</div>
												</div>
											))}
									</div>
								</div>
							))}

							<div className="text-center mt-5">
								<button 
									className='btn btn-primary btn-lg px-5 rounded-pill shadow-sm'
									onClick={handleSubmit}
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<FaSpinner className="me-2 fa-spin" />
											Submitting...
										</>
									) : (
										'Submit Feedback'
									)}
								</button>
								
								{missingValues.length !== 0 && (
									<div className="alert alert-danger mt-3 d-inline-flex align-items-center">
										<FaTimesCircle className="me-2" />
										Please answer all questions before submitting
									</div>
								)}
							</div>
						</form>
					</div>
				</div>
			</div>

			{/* Confirmation Dialog */}
			{showConfirmDialog && (
				<div className="modal fade show" style={{ display: 'block' }}>
					<div className="modal-dialog modal-dialog-centered">
						<div className="modal-content">
							<div className="modal-header">
								<h5 className="modal-title">Confirm Submission</h5>
								<button
									type="button"
									className="btn-close"
									onClick={() => setShowConfirmDialog(false)}
								></button>
							</div>
							<div className="modal-body">
								<p>Are you sure you want to submit your feedback? This action cannot be undone.</p>
							</div>
							<div className="modal-footer">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => setShowConfirmDialog(false)}
								>
									Cancel
								</button>
								<button
									type="button"
									className="btn btn-primary"
									onClick={handleConfirmSubmit}
									disabled={isSubmitting}
								>
									{isSubmitting ? (
										<>
											<FaSpinner className="me-2 fa-spin" />
											Submitting...
										</>
									) : (
										'Submit'
									)}
								</button>
							</div>
						</div>
					</div>
				</div>
			)}

			{/* Custom Styles */}
			<style jsx>{`
				.hover-shadow {
					transition: all 0.3s ease;
				}
				.hover-shadow:hover {
					transform: translateY(-2px);
					box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
				}
				.section-header {
					background: linear-gradient(to right, #f8f9fa, #ffffff);
					padding: 1rem;
					border-radius: 0.5rem;
					margin-bottom: 2rem;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
				}
				.options-grid {
					display: grid;
					grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
					gap: 1rem;
				}
				.option-item {
					padding: 1rem;
					border: 2px solid #e9ecef;
					border-radius: 0.75rem;
					cursor: pointer;
					transition: all 0.2s ease;
					display: flex;
					align-items: center;
					background-color: #ffffff;
				}
				.option-item:hover {
					background-color: #f8f9fa;
					transform: translateY(-1px);
					border-color: #dee2e6;
				}
				.option-item.selected {
					background-color: #e7f5ff;
					border-color: #74c0fc;
					box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
				}
				.form-check-input {
					cursor: pointer;
					width: 1.2em;
					height: 1.2em;
					margin-top: 0.1em;
				}
				.form-check-label {
					cursor: pointer;
					margin-left: 0.75rem;
					flex-grow: 1;
					font-weight: 500;
				}
				.modal {
					background-color: rgba(0, 0, 0, 0.5);
				}
				.card {
					border-radius: 1rem;
					overflow: hidden;
				}
				.badge {
					font-size: 0.9rem;
					font-weight: 500;
				}
			`}</style>
		</div>
	);
};

export default FeedbackPage;
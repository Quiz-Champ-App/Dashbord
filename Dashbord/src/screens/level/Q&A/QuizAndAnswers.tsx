import QuizCard from "../../../components/card/QuizCard";
import ScreenHeader from "../../../components/header/screen/ScreenHeader";

import { useNavigate } from "react-router-dom";
import "./quiz_styles.scss";
import { useParams } from "react-router-dom";
import useAxios from "../../../utils/useAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import Loading from "../../../components/loading/Loading";
import { useFormik } from "formik";
import { useState } from "react";
import Popup from "../../../components/popup/Popup";
import TextInput from "../../../components/input/TextInput";
import SecondaryBtn from "../../../components/buttons/SecondaryBtn";

interface QuizCreateValues {
  level_id: number;
  question_text_si: string;
  question_text_en: string;
  answers: {
    answer_text_en: string;
    answer_text_si: string;
    is_correct: boolean;
  }[];
}

const QuizAndAnswers = () => {
  const { level_id } = useParams();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const [handleDeleteOpen, setHandleDeleteOpen] = useState<boolean>(false);
  const queryClient = useQueryClient();
  const { AxiosRequest } = useAxios();

  const { handleChange, handleSubmit, values, touched, errors, resetForm } =
    useFormik<QuizCreateValues>({
      initialValues: {
        level_id: level_id ? parseInt(level_id) : 0,
        question_text_si: "",
        question_text_en: "",
        answers: [
          {
            answer_text_en: "",
            answer_text_si: "",
            is_correct: false,
          },
        ],
      },
      onSubmit: async (values: QuizCreateValues) => {
        try {
          if (isEditing) {
            //   await editSubjectMutate.mutateAsync({
            //     id: subjectId,
            //     data: values,
            //   });
          } else {
            await mutateAsync(values);
            console.log("Form submitted successfully:", values);
            resetForm();
            setIsEditing(false);
          }
        } catch (error) {
          console.error("Error during form submission:", error);
        }
      },
    });

  //create quiz
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: QuizCreateValues) => {
      const finalVal = {
        level_id: values.level_id,
        question_text_si: values.question_text_si,
        question_text_en: values.question_text_en,
        answers: values.answers.map((answer) => ({
          answer_text_en: answer.answer_text_en,
          answer_text_si: answer.answer_text_si,
          is_correct: answer.is_correct,
        })),
      };

      const response = await AxiosRequest({
        method: "POST",
        url: `question`,
        data: finalVal,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["quiz-data"] });
      handlePopupClose();
    },
    onError: (error) => {
      console.error("Error creating quiz:", error);
    },
  });

  const { data: quizData = [], isFetching } = useQuery({
    queryKey: ["quiz-data", level_id],
    queryFn: async () => {
      const response = await AxiosRequest({
        method: "GET",
        url: `question/level/${level_id}`,
      });
      return response.data;
    },

    enabled: !!level_id,
  });

  const handlePopupOpen = () => {
    setHandleOpen(true);
  };

  const handlePopupClose = () => {
    setHandleOpen(false);
    setIsEditing(false);
    resetForm();
  };

  return (
    <div id="screen_container">
          {(isPending || isFetching) && (
                <Loading />
              )}
      <ScreenHeader
        onBack={() => navigate(-1)}
        title="Quiz and Answers"
        btn={
          <SecondaryBtn
            onClick={handlePopupOpen}
            color="primary"
            variant="contained"
            
          />
        }
      />
      <Popup
        title="Create Quiz"
        isOpen={handleOpen}
        onClick={handleSubmit}
        handleClose={handlePopupClose}
        content={
          <>
            <TextInput
              label="Question in Sinhala"
              name="question_text_si"
              value={values.question_text_si}
              onChange={handleChange}
              error={errors.question_text_si}
              touched={touched.question_text_si}
              type="text"
              disabled={false}
            />

            <div className="answers-section">
              <h4>Answers</h4>
              {values.answers.map((answer, index) => (
                <div key={index} className="answer-inputs">
                  <TextInput
                    label={`Answer ${index + 1} (SI)`}
                    name={`answers[${index}].answer_text_si`}
                    value={answer.answer_text_si}
                    onChange={handleChange}
                    type="text"
                    disabled={false}
                  />

                  <label className="checkbox-label">
                    <input
                      type="checkbox"
                      name={`answers[${index}].is_correct`}
                      checked={answer.is_correct}
                      onChange={() => {
                        const newAnswers = [...values.answers];
                        newAnswers[index].is_correct =
                          !newAnswers[index].is_correct;
                        resetForm({
                          values: { ...values, answers: newAnswers },
                        });
                      }}
                    />
                    Correct
                  </label>
                </div>
              ))}

              <SecondaryBtn
                onClick={() => {
                  resetForm({
                    values: {
                      ...values,
                      answers: [
                        ...values.answers,
                        {
                          answer_text_en: "",
                          answer_text_si: "",
                          is_correct: false,
                        },
                      ],
                    },
                  });
                }}
              />
            </div>
          </>
        }
      />

      <div className="quiz-container">
     

        {quizData.map((quiz) => (
          <QuizCard
            key={quiz.id}
            question={quiz.question_text_si}
            options={quiz.answers.map((answer) => answer.answer_text_si)}
            correctAnswer={
              quiz.answers.find((answer) => answer.is_correct)?.answer_text_si
            }
          />
        ))}
      </div>
    </div>
  );
};

export default QuizAndAnswers;

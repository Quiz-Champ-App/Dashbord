import SecondaryBtn from "../../components/buttons/SecondaryBtn";
import ScreenHeader from "../../components/header/screen/ScreenHeader";
import { useNavigate } from "react-router-dom";
import Popup from "../../components/popup/Popup";
import TextInput from "../../components/input/TextInput";
import { useParams } from "react-router-dom";
import { useFormik } from "formik";
import { useMutation, useQuery } from "@tanstack/react-query";
import useAxios from "../../utils/useAxios";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import Loading from "../../components/loading/Loading";
import Card from "../../components/card/Card";
import Alart from "../../components/alart/Alart";
import "./level.scss";

const Levels = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { grade } = useParams();
  const { AxiosRequest } = useAxios();
  const queryClient = useQueryClient();
  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const [handleDeleteOpen, setHandleDeleteOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [level, setLevel] = useState<number>(0);

  interface LevelCreateValues {
    level: number;
    subject_id: number;
    grade_id: number;
    unlock_points: number;
    passing_marks: number;
    time_limit: number;
  }

  const formik = useFormik<LevelCreateValues>({
    initialValues: {
      level: 0,
      subject_id: id ? parseInt(id, 10) : 0,
      grade_id: grade ? parseInt(grade, 10) : 0,
      unlock_points: 0,
      passing_marks: 0,
      time_limit: 0,
    },
    onSubmit: async (values) => {
      console.log("Submitting form:", values);
      try {
        if (isEditing) {
          // await editSubjectMutate.mutateAsync({
          //   id: subjectId,
          //   data: values,
          // });
        } else {
          await mutateAsync(values);
        }
        console.log("Form submitted successfully:", values);
        formik.resetForm();
        setIsEditing(false);
      } catch (error) {
        console.error("Error submitting form:", error);
      }
    },
  });

  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: LevelCreateValues) => {
      const finalValues = {
        level: values.level,
        unlock_points: values.unlock_points,
        subject_id: id ? parseInt(id, 10) : 0,
        grade_id: grade ? parseInt(grade, 10) : 0,
        passing_marks: values.passing_marks,
        time_limit: values.time_limit,
      };

      const response = await AxiosRequest({
        url: "/level",
        method: "POST",
        data: finalValues,
      });
      console.log("Response from level creation:", response);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-level-data"] });
      setHandleOpen(false);
    },
    onError: (error) => {
      console.error("Error during level creation:", error);
    },
  });

  const handlePopupOpen = () => {
    setIsEditing(false);
    formik.resetForm();
    setHandleOpen(true);
  };

  const handlePopupClose = () => {
    setHandleOpen(false);
  };

  //get all levels
  const { data: levelsData = [], isFetching } = useQuery({
    queryKey: ["fetch-level-data"],
    queryFn: async () => {
      const response = await AxiosRequest({
        url: `/level`,
        method: "GET",
      });
      return response.data;
    },
  });

  // delete subject
  const deleteMutation = useMutation({
    mutationFn: async ({
      grade_id,
      subject_id,
      level,
    }: {
      grade_id: number;
      subject_id: number;
      level: number;
    }) => {
      const response = await AxiosRequest({
        url: `/level/${level}/${grade_id}/${subject_id}`,
        method: "DELETE",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-level-data"] });
      setHandleDeleteOpen(false);
      
    },
    onError: (error: string) => {
      console.error("Error deleting subject:", error);
    },
  });

  const handleDelete = async (level: number) => {
  
      await deleteMutation.mutateAsync({
        grade_id: parseInt(grade as string),
        subject_id: parseInt(id as string),
        level,
      });
   
  };

  const isPendingDelete = deleteMutation.isPending;

  const openDeletePopup = (level: number) => {
    setHandleDeleteOpen(true);
    setLevel(level);
    
  };

  return (
    <div id="screen_container">
      {(isPending || isFetching || isPendingDelete) && <Loading />}
      <ScreenHeader
        title="Levels"
        onBack={() => navigate(-1)}
        btn={
          <SecondaryBtn
            variant="contained"
            color="primary"
            onClick={handlePopupOpen}
          />
        }
      />
      <Popup
        isOpen={handleOpen}
        handleClose={handlePopupClose}
        onClick={formik.handleSubmit}
        title="Add Level"
        content={
          <>
            <TextInput
              name="level"
              label="Level"
              value={formik.values.level}
              onChange={formik.handleChange}
              error={formik.errors.level}
              touched={formik.touched.level}
              type="number"
            />
            <TextInput
              name="unlock_points"
              label="Unlock Points"
              value={formik.values.unlock_points}
              onChange={formik.handleChange}
              error={formik.errors.unlock_points}
              touched={formik.touched.unlock_points}
              type="number"
            />

            <TextInput
              name="passing_marks"
              label="Parssing Marks"
              value={formik.values.passing_marks}
              onChange={formik.handleChange}
              error={formik.errors.passing_marks}
              touched={formik.touched.passing_marks}
              type="number"
            />
            <TextInput
              name="time_limit"
              label="Time Limit"
              value={formik.values.time_limit}
              onChange={formik.handleChange}
              error={formik.errors.time_limit}
              touched={formik.touched.time_limit}
              type="number"
            />
          </>
        }
      />
       <Alart
          title="Are you sure to delete?"
          open={handleDeleteOpen}
          handleClose={() => setHandleDeleteOpen(false)}
          handleConfirm={()=>handleDelete(level)}
        />
      <div className="level-container">
        {levelsData.map((level, index: number) => (
          <div className="card" key={index}>
            <Card
            
              title={`Level ${level?.level}`}
              onDelete={() => {
                openDeletePopup(level?.level);
              }}
              passingMarks={level?.passing_marks}
              unlockPoints={level?.unlock_points}
              timeLimit={level?.time_limit}  
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Levels;

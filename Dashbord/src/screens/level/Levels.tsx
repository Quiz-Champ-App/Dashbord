import SecondaryBtn from "../../components/buttons/SecondaryBtn";
import ScreenHeader from "../../components/header/screen/ScreenHeader";
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
import { useNavigate } from "react-router-dom";
import "./level.scss";

interface LevelCreateValues {
  level: number;
  subject_id: number;
  grade_id: number;
  unlock_points: number;
  passing_marks: number;
  time_limit: number;
}

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
  const [fetchError, setFetchError] = useState<string | null>(null);

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
          await handleEditLevel.mutateAsync({
            level_id: level,
            
            data: values,
          });
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

  // create a new level
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
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-level-data"] });
      setHandleOpen(false);
    },
    onError: (error) => {
      console.error("Error during level creation:", error);
    },
  });

  // fetch level by ID
  const fetchLevelById = async (level_id: number) => {
    try {
      const response = await AxiosRequest({
        url: `/level/${level_id}`,
        method: "GET",
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching level:", error);
    }
  };

  const handlePopupOpen = () => {
    setIsEditing(false);
    formik.resetForm();
    setHandleOpen(true);
  };

  const handlePopupClose = () => {
    setHandleOpen(false);
    setIsEditing(false);
    setFetchError(null);
    formik.resetForm();
  };

  // get all levels
  const { data: levelsData = [], isFetching } = useQuery({
    queryKey: ["fetch-level-data", id, grade],
    queryFn: async () => {
      const response = await AxiosRequest({
        url: `/level/grade/${grade}/subject/${id}`,
        method: "GET",
      });
      return response.data;
    },
  });

  // delete level
  const deleteMutation = useMutation({
    mutationFn: async ({ level_id }: { level_id: number }) => {
      const response = await AxiosRequest({
        url: `/level/${level_id}`,
        method: "DELETE",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-level-data"] });
      setHandleDeleteOpen(false);
    },
    onError: (error) => {
      console.error("Error deleting level:", error);
    },
  });

  const handleDelete = async (level_id: number) => {
   
    await deleteMutation.mutateAsync({
      level_id,
    });
  };

  const isPendingDelete = deleteMutation.isPending;

  const openDeletePopup = (level: number) => {
    setHandleDeleteOpen(true);
    setLevel(level);
  };

  // edit level
  const handleEditLevel = useMutation({
    mutationFn: async ({
     
      level_id,
      data,
    }: {
      level_id: number;
    
      data: LevelCreateValues;
    }) => {
      const response = await AxiosRequest({
        url: `/level/${level_id}`,
        method: "PATCH",
        data: data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-level-data"] });
      setHandleOpen(false);
    },
    onError: (error: unknown) => {
      console.error("Error editing level:", error);
    },
  });

  const handleEditPopup = async (levelNum: number) => {
    try {
      setLevel(levelNum);
      setIsEditing(true);
      setFetchError(null);

      const levelData = await fetchLevelById(levelNum);

      if (levelData) {
        // update form values with existing data
        formik.setValues({
          level: levelData.level,
          subject_id: id ? parseInt(id, 10) : 0,
          grade_id: grade ? parseInt(grade, 10) : 0,
          unlock_points: levelData.unlock_points,
          passing_marks: levelData.passing_marks,
          time_limit: levelData.time_limit,
        });

        setHandleOpen(true);
      } else {
        console.error("Failed to fetch level data");
      }
    } catch (error) {
      console.error("Error setting up edit form:", error);
    }
  };

  const isEditPending = handleEditLevel.isPending;

  //navigate to Q&A screen
  const handleNavigate = (level_id: number, event: React.MouseEvent) => {
    if (!(event.target as Element).closest(".subject-icon-wrapper")) {
      navigate(`/subject/${id}/${grade}/${level_id}`);
    }
  };

  return (
    <div id="screen_container">
      {(isPending || isFetching || isPendingDelete || isEditPending) && (
        <Loading />
      )}
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
        title={isEditing ? "Edit Level" : "Add Level"}
        content={
          <>
            {fetchError && <div className="error-message">{fetchError}</div>}
            <TextInput
              name="level"
              label="Level"
              value={formik.values.level}
              onChange={formik.handleChange}
              error={formik.errors.level}
              touched={formik.touched.level}
              type="number"
              disabled={isEditing} // Disable input if editing
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
              label="Passing Marks" // Fixed typo: "Parssing" -> "Passing"
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
        handleConfirm={() => handleDelete(level)}
      />
      <div className="level-container">
        {levelsData.map((level, index: number) => (
          <div className="card" key={index}>
            <Card
              title={`Level ${level?.level}`}
              onDelete={() => {
                openDeletePopup(level?.level_id);
              }}
              passingMarks={level?.passing_marks}
              unlockPoints={level?.unlock_points}
              timeLimit={level?.time_limit}
              onEdit={() => {
                handleEditPopup(level?.level_id);
              }}
              onClick={(event: React.MouseEvent) =>
                handleNavigate(level?.level_id, event)
              }
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Levels;

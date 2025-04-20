import { Button } from "@mui/material";
import "./style.scss";
import { BookOpen, Pencil, Plus, Trash2 } from "lucide-react";
import Popup from "../../components/popup/Popup";
import TextInput from "../../components/input/TextInput";
import DropDown from "../../components/input/DropDown";
import { useState } from "react";
import useAxios from "../../utils/useAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Loading from "../../components/loading/Loading";
import Alart from "../../components/alart/Alart";
import { useNavigate } from "react-router-dom";
import ScreenHeader from "../../components/header/screen/ScreenHeader";

interface SubjectCreateValues {
  subject_name_si: string;
  subject_name_en: string;
  subject_type: string;
}

const Subjects = () => {
  const { AxiosRequest } = useAxios();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const [handleDeleteOpen, setHandleDeleteOpen] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [subjectId, setSubjectId] = useState<number>(0);

  const availableColors = [
    "subject-math",
    "subject-cs",
    "subject-lit",
    "subject-chem",
    "subject-bio",
    "subject-geo",
    "subject-music",
    "subject-art",
  ];

  const formik = useFormik<SubjectCreateValues>({
    initialValues: {
      subject_name_si: "",
      subject_name_en: "",
      subject_type: "",
    },
    onSubmit: async (values) => {
      console.log("Submitting form:", values);
      try {
        if (isEditing) {
          await editSubjectMutate.mutateAsync({
            id: subjectId,
            data: values,
          });
        } else {
          await mutateAsync(values);
        }
        console.log("Form submitted successfully:", values);
        formik.resetForm();
        setIsEditing(false);
      } catch (error) {
        console.error("Error during form submission:", error);
      }
    },
  });

  // create a new subject
  const { mutateAsync, isPending } = useMutation({
    mutationFn: async (values: SubjectCreateValues) => {
      const finalVal = {
        subject_name_si: values.subject_name_si,
        subject_name_en: values.subject_name_en,
        subject_type: values.subject_type,
      };
      const response = await AxiosRequest({
        url: "/subject",
        method: "POST",
        data: finalVal,
      });
      console.log("Response from subject creation:", response);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-subject-data"] });
      handlePopupClose();
    },
    onError: (error: string) => {
      console.log("Subject creation error:", error);
    },
  });

  // get all subjects
  const { data: subjectsData = [], isFetching } = useQuery({
    queryKey: ["fetch-subject-data"],
    queryFn: async () => {
      const response = await AxiosRequest({
        url: "/subject",
        method: "GET",
      });
      return response.data;
    },
  });

  // Get subject by ID
  const fetchSubjectById = async (id: number) => {
    const response = await AxiosRequest({
      url: `/subject/${id}`,
      method: "GET",
    });
    return response.data;
  };

  // delete subject
  const deleteMutation = useMutation({
    mutationFn: async (id: number) => {
      const response = await AxiosRequest({
        url: `/subject/${id}`,
        method: "DELETE",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-subject-data"] });
      setHandleDeleteOpen(false);
    },
    onError: (error: string) => {
      console.error("Error deleting subject:", error);
    },
  });

  // edit subject
  const editSubjectMutate = useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: number;
      data: SubjectCreateValues;
    }) => {
      const response = await AxiosRequest({
        url: `/subject/${id}`,
        method: "PATCH",
        data: data,
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-subject-data"] });
      handlePopupClose();
    },
    onError: (error: string) => {
      console.error("Error updating subject:", error);
    },
  });

  const handlePopupOpen = () => {
    setIsEditing(false);
    formik.resetForm();
    setHandleOpen(true);
  };

  const handlePopupOpenEdit = async (id: number) => {
    try {
      setIsEditing(true);
      setSubjectId(id);
      const subjectData = await fetchSubjectById(id);

      formik.setValues({
        subject_name_si: subjectData.subject_name_si || "",
        subject_name_en: subjectData.subject_name_en || "",
        subject_type: subjectData.subject_type || "",
      });

      setHandleOpen(true);
    } catch (error) {
      console.error("Error fetching subject for edit:", error);
    }
  };


  const handlePopupClose = () => {
    setHandleOpen(false);
    setIsEditing(false);
    formik.resetForm();
  };

  const openDeletePopup = (id: number) => {
    setHandleDeleteOpen(true);
    setSubjectId(id);
  };

  const handleDelete = () => {
    deleteMutation.mutate(subjectId);
  };

  // get a consistent color for a subject
  const getSubjectColor = (index) => {
    const colorIndex = index % availableColors.length;
    return availableColors[colorIndex];
  };

  const isDeletePending = deleteMutation.isPending;
  const isEditPending = editSubjectMutate.isPending;

  const navigateToSubject = (id: number, event: React.MouseEvent) => {
    // only navigate if the click was on the card itself, not on the action buttons
    if (!(event.target as Element).closest(".subject-icon-wrapper")) {
      navigate(`/subject/${id}`);
    }
  };


  return (
    <div id="subjects_container">
      {(isPending || isDeletePending || isEditPending || isFetching) && (
        <Loading />
      )}
      <ScreenHeader
        btn={
          <Button
            variant="contained"
            color="primary"
            className="add-subject-btn"
            onClick={handlePopupOpen}
            startIcon={<Plus />}
          >
            Add Subject
          </Button>
        }
      />
      <div className="popup-wrapper">
        <Popup
          title={isEditing ? "Edit Subject" : "Add Subject"}
          isOpen={handleOpen}
          handleClose={handlePopupClose}
          onClick={formik.handleSubmit}
          content={
            <>
              <TextInput
                name="subject_name_si"
                onChange={formik.handleChange}
                value={formik.values.subject_name_si}
                label="Subject Name Sinhala"
                touched={formik.touched.subject_name_si}
                error={formik.errors.subject_name_si}
              />
              <TextInput
                name="subject_name_en"
                onChange={formik.handleChange}
                value={formik.values.subject_name_en}
                label="Subject Name English"
                touched={formik.touched.subject_name_en}
                error={formik.errors.subject_name_en}
              />
              <DropDown
                name="subject_type"
                onChange={formik.handleChange}
                value={formik.values.subject_type}
                label="Subject Type"
                touched={formik.touched.subject_type}
                error={formik.errors.subject_type}
                helperText="Select the type of subject"
                options={[
                  { value: "main", label: "main" },
                  { value: "bucket_one", label: "Bucket 1" },
                  { value: "bucket_two", label: "Bucket 2" },
                  { value: "bucket_three", label: "Bucket 3" },
                ]}
              />
            </>
          }
        />

        <Alart
          title="Are you sure to delete?"
          open={handleDeleteOpen}
          handleClose={() => setHandleDeleteOpen(false)}
          handleConfirm={handleDelete}
        />
      </div>

      <div id="subjects">
        <div className="subjects-grid">
          {subjectsData.map((subject, index) => {
            const color = getSubjectColor(index);

            return (
              <div
                key={index}
                className={`subject-card ${color}`}
                onClick={(event) =>
                  navigateToSubject(subject.subject_id, event)
                }
              >
                <div className="subject-icon-wrapper">
                  <Trash2 onClick={() => openDeletePopup(subject.subject_id)} />
                  <Pencil
                    onClick={() => handlePopupOpenEdit(subject.subject_id)}
                  />
                </div>

                <div className="subject-icon">
                  <BookOpen />
                </div>
                <h3 className="subject-title">{subject.subject_name_en}</h3>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Subjects;

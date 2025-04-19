import { Button } from "@mui/material";
import "./style.scss";
import { BookOpen, DeleteIcon, Pencil, Plus, Trash2 } from "lucide-react";
import Popup from "../../components/popup/Popup";
import TextInput from "../../components/input/TextInput";
import DropDown from "../../components/input/DropDown";
import { useState } from "react";
import useAxios from "../../utils/useAxios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useFormik } from "formik";
import Loading from "../../components/loading/Loading";
import Alart from "../../components/alart/Alart";

interface SubjectCreateValues {
  subject_name_si: string;
  subject_name_en: string;
  subject_type: string;
}

const Subjects = () => {
  const { AxiosRequest } = useAxios();
  const queryClient = useQueryClient();

  const [handleOpen, setHandleOpen] = useState<boolean>(false);
  const [handleDeleteOpen, setHandleDeleteOpen] = useState<boolean>(false);
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

  const handlePopupOpen = () => {
    setHandleOpen(true);
  };
  const handlePopupOpenEdit = () => {
    setHandleOpen(true);
  };

  const handlePopupClose = () => {
    setHandleOpen(false);
  };

  //add a new subject
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

  const { handleSubmit, handleChange, values, errors, touched, resetForm } =
    useFormik<SubjectCreateValues>({
      initialValues: {
        subject_name_si: "",
        subject_name_en: "",
        subject_type: "",
      },

      onSubmit: async (values) => {
        console.log("Submitting form:", values);
        try {
          await mutateAsync(values);
          console.log("Form submitted successfully:", values);
          resetForm();
        } catch (error) {
          console.error("Error during form submission:", error);
        }
      },
    });
// get subject data
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

  const { data: subjectsDataById, isLoading } = useQuery({
    queryKey: ["fetch-subject-data"],
    queryFn: async (id) => {
      const response = await AxiosRequest({
        url: `/subject/${id}`,
        method: "GET",
      });
    
      return response.data;
     
    },
  });

  
  
  // delete subject
  const openDeletePopup = (id:number) => {
    setHandleDeleteOpen(true);
    setSubjectId(id);
  };

  
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

  const isDeletePending = deleteMutation.isPending;

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id);
  };

  // get a consistent color for a subject
  const getSubjectColor = (index) => {
    const colorIndex = index % availableColors.length;
    return availableColors[colorIndex];
  };


  //edit subject
  const editSubjectMutate = useMutation({
    mutationFn: async (id: number) => {
      const response = await AxiosRequest({
        url: `/subject/${id}`,
        method: "PUT",
      });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["fetch-subject-data"] });
    },
    onError: (error: string) => {
      console.error("Error deleting subject:", error);
    },
  });

  const handleEdit = (id: number) => {
    editSubjectMutate.mutate(id);
  };

  return (
    <div id="subjects_container">
      {(isPending || isDeletePending) && <Loading />}
      {isFetching && <Loading />}

      <div className="popup-wrapper">
        <Popup
          title="Add Subject"
          isOpen={handleOpen}
          handleClose={handlePopupClose}
          onClick={handleSubmit}
          content={
            <>
              <TextInput
                name="subject_name_si"
                onChange={handleChange}
                value={values.subject_name_si}
                label="Subject Name Sinhala"
                touched={touched.subject_name_si}
                error={errors.subject_name_si}
              />
              <TextInput
                name="subject_name_en"
                onChange={handleChange}
                value={values.subject_name_en}
                label="Subject Name English"
                touched={touched.subject_name_en}
                error={errors.subject_name_en}
              />
              <DropDown
                name="subject_type"
                onChange={handleChange}
                value={values.subject_type}
                label="Subject Type"
                touched={touched.subject_type}
                error={errors.subject_type}
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
        <Popup
          title="Edit Subject"
          isOpen={handleOpen}
          handleClose={handlePopupClose}
          onClick={handleSubmit}
          content={
            <>
              <TextInput
                name="subject_name_si"
                onChange={handleChange}
                value={subjectsDataById?.subject_name_si}
                label="Subject Name Sinhala"
                touched={touched.subject_name_si}
                error={errors.subject_name_si}
              />
              <TextInput
                name="subject_name_en"
                onChange={handleChange}
                value={subjectsDataById?.subject_name_en}
                label="Subject Name English"
                touched={touched.subject_name_en}
                error={errors.subject_name_en}
              />
              <DropDown
                name="subject_type"
                onChange={handleChange}
                value={subjectsDataById?.subject_type}
                label="Subject Type"
                touched={touched.subject_type}
                error={errors.subject_type}
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
          handleConfirm={()=>handleDelete(subjectId)}
        />
      </div>
      <div id="subjects">
        <Button
          variant="contained"
          color="secondary"
          className="add-subject-btn"
          onClick={handlePopupOpen}
          startIcon={<Plus />}
        >
          Add Subject
        </Button>
        <div className="subjects-grid">
          {subjectsData.map((subject, index) => {
            const color = getSubjectColor(index);

            return (
              <div key={index} className={`subject-card ${color}`}>
                <div className="subject-icon-wrapper">
                  <Trash2 onClick={() => openDeletePopup(subject?.subject_id)} />
                  <Pencil onClick={()=>handlePopupOpenEdit()}/>
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

import api from "./axios";

export const getProfile = async () => {
  try {
    const response = await api.get("/api/users/profile");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getStuId = async () => {
  try {
    const response = await api.get("/api/users/stu-id");
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// Prefix-searches students by their studentId (e.g. "STU_1000") for the
// chat page's "Global" section.
export const searchStudentByStudentId = async (query) => {
  try {
    const response = await api.get("/api/users/search-student", {
      params: { studentId: query },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

// `fields` is a flat object of form fields (e.g. { emailVerified: true }).
// Sent as multipart/form-data since the backend route also accepts a profile photo upload.
export const updateProfile = async (fields = {}) => {
  try {
    const formData = new FormData();
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined) formData.append(key, value);
    });

    const response = await api.patch("/api/users/update", formData);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

import {
  UseMutationResult,
  useMutation,
  useQuery,
  UseQueryResult,
} from '@tanstack/react-query';

const baseUrl = 'http://localhost:3002/';

interface LoginInputs {
  username: string;
  password: string;
}

interface CreateCourseInputs {
  courseName: string;
  courseCode: string;
  studentGroup: string;
  file: File;
}

interface CourseCheckInputs {
  codes: string;
  studentGroups: string;
}

const doFetch = async (url: string, options: RequestInit) => {
  const response = await fetch(url, options);
  const json = await response.json();

  if (!response.ok) {
    const message = json.error ? `${json.error}` : json.message;
    throw new Error(message || response.statusText);
  }
  return json;
};

const postLogin = async (inputs: LoginInputs) => {
  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: inputs.username,
      password: inputs.password,
    }),
  };

  return doFetch(baseUrl + 'users', options);
};

const createCourse = async (inputs: CreateCourseInputs) => {
  const { courseName, courseCode, studentGroup, file } = inputs;

  const formData = new FormData();
  formData.append('courseName', courseName);
  formData.append('courseCode', courseCode);
  formData.append('studentGroup', studentGroup);
  formData.append('file', file);

  const options: RequestInit = {
    method: 'POST',
    body: formData,
  };

  return doFetch(`${baseUrl}courses/create`, options);
};

const checkIfCourseExists = async (inputs: CourseCheckInputs) => {
  const { codes, studentGroups } = inputs;

  const options: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      codes: codes,
      studentGroups: studentGroups,
    }),
  };

  return doFetch(`${baseUrl}courses/check`, options);
};

const usePostLogin = (): UseMutationResult<
  unknown,
  Error,
  LoginInputs,
  unknown
> => {
  return useMutation({
    mutationFn: postLogin,
  });
};
const useCreateCourse = (): UseMutationResult<
  unknown,
  Error,
  CreateCourseInputs,
  unknown
> => {
  return useMutation({
    mutationFn: createCourse,
  });
};

export function useCheckIfCourseExists<T = unknown>(): UseMutationResult<
  T,
  Error,
  CourseCheckInputs,
  unknown
> {
  return useMutation<T, Error, CourseCheckInputs, unknown>({
    mutationFn: checkIfCourseExists,
  });
}

const apiHooks = {
  usePostLogin,
  postLogin,
  useCreateCourse,
  useCheckIfCourseExists,
};

export default apiHooks;

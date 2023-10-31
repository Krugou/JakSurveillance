'use strict';

//const baseUrl = 'https://jaksec.northeurope.cloudapp.azure.com/backend/';
import { UseMutationResult, UseQueryResult, useMutation, useQuery } from '@tanstack/react-query';

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

const postLogin = async (inputs: LoginInputs) => {
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      username: inputs.username,
      password: inputs.password,
    }),
  };

  const response = await fetch(baseUrl + 'users', options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
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

  const response = await fetch(`${baseUrl}courses/create`, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const checkIfCourseExists = async (inputs: CourseCheckInputs) => {
  const { codes, studentGroups } = inputs;

  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      codes: codes,
      studentGroups: studentGroups,
    }),
  };

  const response = await fetch(`${baseUrl}courses/check`, options);
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
};

const usePostLogin = (): UseMutationResult<unknown, Error, LoginInputs, unknown> => {
  return useMutation({
    mutationFn: postLogin,
  });
};
const useCreateCourse = (): UseMutationResult<unknown, Error, CreateCourseInputs, unknown> => {
  return useMutation({
    mutationFn: createCourse,
  });
};



export function useCheckIfCourseExists<T = unknown>(): UseMutationResult<T, Error, CourseCheckInputs, unknown> {
  return useMutation<T, Error, CourseCheckInputs, unknown>({
    mutationFn: checkIfCourseExists,
  });
}

const apiHooks = {
  usePostLogin,
  useCreateCourse,
  useCheckIfCourseExists,
};

export default apiHooks;

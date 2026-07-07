import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const registerSchema = z.object({
  role: z.enum(['Parent', 'Teacher']),
  schoolCode: z.string().min(1, 'School code is required'),
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  admissionNumber: z.string().optional(),
  dob: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.role === 'Parent' && (!data.admissionNumber || data.admissionNumber.trim() === '')) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Admission Number is required for parents",
      path: ["admissionNumber"]
    });
  }
});

const Register = () => {
  const { register: registerUser } = useAuth();
  const navigate = useNavigate();

  const { register, handleSubmit, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      role: 'Teacher',
      schoolCode: '',
      name: '',
      email: '',
      password: '',
      admissionNumber: '',
      dob: ''
    }
  });

  const selectedRole = watch('role');

  const onSubmit = async (data: any) => {
    try {
      await registerUser(data);
      toast.success('Joined successfully!');
      navigate('/dashboard');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to join the school');
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-extrabold text-slate-900">Join Your School</h2>
        <p className="mt-2 text-sm text-slate-600">
          Enter your School Code to join as a Teacher or Parent.
        </p>
      </div>

      <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          
          <div>
            <label className="block text-sm font-medium text-slate-700">Role</label>
            <div className="mt-1">
              <select
                {...register('role')}
                className="block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              >
                <option value="Teacher">Teacher</option>
                <option value="Parent">Parent</option>
              </select>
              {errors.role && <p className="mt-1 text-sm text-red-600">{errors.role.message as string}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">School Code</label>
            <div className="mt-1">
              <input
                {...register('schoolCode')}
                type="text"
                placeholder="e.g. DPS-5624"
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm font-mono uppercase"
              />
              {errors.schoolCode && <p className="mt-1 text-sm text-red-600">{errors.schoolCode.message as string}</p>}
            </div>
          </div>

          {selectedRole === 'Parent' && (
            <div className="bg-slate-50 p-4 rounded-md border border-slate-200 space-y-4">
              <h3 className="text-sm font-medium text-slate-800">Student Verification</h3>
              <div>
                <label className="block text-sm font-medium text-slate-700">Student Admission Number</label>
                <div className="mt-1">
                  <input
                    {...register('admissionNumber')}
                    type="text"
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                  {errors.admissionNumber && <p className="mt-1 text-sm text-red-600">{errors.admissionNumber.message as string}</p>}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-700">Student Date of Birth <span className="text-slate-400 font-normal">(Optional)</span></label>
                <div className="mt-1">
                  <input
                    {...register('dob')}
                    type="date"
                    className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                  />
                </div>
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700">Your Full Name</label>
            <div className="mt-1">
              <input
                {...register('name')}
                type="text"
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message as string}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Email address</label>
            <div className="mt-1">
              <input
                {...register('email')}
                type="email"
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message as string}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700">Password</label>
            <div className="mt-1">
              <input
                {...register('password')}
                type="password"
                className="appearance-none block w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm placeholder-slate-400 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
              />
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message as string}</p>}
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 transition-colors"
            >
              {isSubmitting ? 'Joining...' : 'Join School'}
            </button>
          </div>

          <div className="mt-6 text-center text-sm">
            <span className="text-slate-600">Already have an account? </span>
            <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
              Sign in here
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;

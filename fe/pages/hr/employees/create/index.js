import { useRouter } from "next/router";
import useSWR from "swr";
import AdminLayout from "../../../../components/AdminLayout";
import { useState } from "react";
import dayjs from "dayjs";
import axiosInstance from "../../../../utils/axiosInstance";
import AlertMessages from "../../../../components/AlertMessages";
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from "yup";
import { useForm } from "react-hook-form";


const EmployeeSchema = yup.object().shape({
    id: yup.string().required("This field is required."),
	email: yup.string().required("This field is required.").email("must be a valid email"),
    firstname: yup.string().required("This field is required.").max(255, "Only 255 characters is allowed."),
    lastname: yup.string().required("This field is required.").max(255, "Only 255 characters is allowed."),
    mi: yup.string().required("This field is required.").max(2, "Only 1 or 2 characters is allowed."),
    position: yup.string().required("This field is required."),
    emptype: yup.string().required("This field is required."),
    password: yup.string().required("This field is required.").min(8,"Password must be 8 characters long"),
    confirm_password: yup.string().oneOf([yup.ref('password'), null], 'Passwords must match'),
	//firstname: yup.number().typeError('This field is required and must be a number').min(0, "Must be greater than 0"),
	date_hired: yup.date().typeError('Must be a date').required("This field is required."),
});

export default function AddEmployee(){

	const { register, handleSubmit, formState: { errors }, reset } = useForm({
		mode: 'onSubmit',
		resolver: yupResolver(EmployeeSchema),
	})

	const [status, setStatus] = useState({
		error: false,
		loading: false,
		success: false,
		infoMessage: '',
	})

    function onClickSubmit(data){
        var currentdate = new Date();
        var dhired = data.date_hired;
        var timeString = currentdate.getHours() + ':' + currentdate.getMinutes() + ':00';

        var year = dhired.getFullYear();
        var month = dhired.getMonth() + 1;
        var day = dhired.getDate();
        var dateString = '' + year + '-' + month + '-' + day + ' ' + timeString;
        //console.log(dateString)
        let newData = {
            user_employee :{
                emp_id: data.id,
                firstname: data.firstname,
                lastname: data.lastname,
                mi: data.mi,
                position: data.position,
                type: data.emptype,
                date_hired: dateString,
            },
            type: 'EMPLOYEE',
            email: data.email,
            is_active: true,
            password: data.password,
            name: data.firstname + " " + data.mi + " " + data.lastname,

        }
		setStatus({ 
			error: false, 
			success: false, 
			loading:true, 
			infoMessage: 'Saving data.' 
		})
        axiosInstance.post(`users/employees/`, newData)
        .then((_e) => {
            setStatus({ 
                error: false, 
                success: true, 
                loading: false, 
                infoMessage: 'Employee successfully Added.' 
            })
            reset()
        }).catch((_e) => {
            if(400 == _e?.response?.status){
                setStatus({ 
                    error: true, 
                    success: false, 
                    loading: false, 
                    infoMessage: _e?.response?.data ?? ''
                })
            }else{
                setStatus({ 
                    error: true, 
                    success: false, 
                    loading: false, 
                    infoMessage: 'Something went wrong.' 
                })
            }
        })
    }

    return (
        <AdminLayout
            title="Add Employee"
            hasBack={true}
        >
            <div className="mt-10 sm:mt-0">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                <div className="mt-5 md:col-span-2 md:mt-0">
                    <form onSubmit={handleSubmit(onClickSubmit)} noValidate>
                        <div className="overflow-hidden shadow sm:rounded-md">
                            <div className="bg-white px-4 py-5 sm:p-6">
                                <AlertMessages
                                    className="mb-3"
                                    error={status.error}
                                    success={status.success}
                                    loading={status.loading}
                                    message={status.infoMessage}
                                />
                                <div className="grid grid-cols-6 gap-6">
                                    <div className="col-span-6 sm:col-span-6">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Employee ID
                                        </label>
                                        <input
                                            {...register('id')} 
                                            type="text"
                                            autoComplete="off"
                                            className="input"
                                        />
                                        <div className="text-red-500 text-sm pt-1">{errors?.id && errors?.id?.message}</div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            First Name
                                        </label>
                                        <input
                                            {...register('firstname')} 
                                            type="text"
                                            autoComplete="off"
                                            className="input"
                                        />
                                        <div className="text-red-500 text-sm pt-1">{errors?.firstname && errors?.firstname?.message}</div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Last Name
                                        </label>
                                        <input
                                            {...register('lastname')} 
                                            type="text"
                                            autoComplete="off"
                                            className="input"
                                        />
                                        <div className="text-red-500 text-sm pt-1">{errors?.lastname && errors?.lastname?.message}</div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Middle Initial
                                        </label>
                                        <input
                                            {...register('mi')} 
                                            type="text"
                                            autoComplete="off"
                                            className="input !w-[100px]"
                                        />
                                        <div className="text-red-500 text-sm pt-1">{errors?.mi && errors?.mi?.message}</div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Position
                                        </label>
                                        <select
                                            id='employee_type'
                                            className='border rounded-[5px] px-2 py-1 bg-white !w-[200px]'
                                            defaultValue='SALESEXECUTIVE'
                                            {...register('emptype')} 
                                        >
                                            <option value='SALESEXECUTIVE'>Sales Executive</option>
                                            <option value='TECHNICIAN'>Technician</option>
                                        </select>
                                        <div className="text-red-500 text-sm pt-1">{errors?.emptype && errors?.emptype?.message}</div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-4">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Rank
                                        </label>
                                        <input
                                            {...register('position')} 
                                            type="text"
                                            autoComplete="off"
                                            className="input"
                                        />
                                        <div className="text-red-500 text-sm pt-1">{errors?.position && errors?.position?.message}</div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-6">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Email
                                        </label>
                                        <input
                                            {...register('email')} 
                                            type="text"
                                            autoComplete="off"
                                            className="input"
                                        />
                                        <div className="text-red-500 text-sm pt-1">{errors?.email && errors?.email?.message}</div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Password
                                        </label>
                                        <input
                                            {...register('password')} 
                                            type="password"
                                            autoComplete="off"
                                            className="input"
                                        />
                                        <div className="text-red-500 text-sm pt-1">{errors?.password && errors?.password?.message}</div>
                                    </div>
                                    <div className="col-span-6 sm:col-span-3">
                                        <label className="block text-sm font-medium text-gray-700">
                                            Confirm Password
                                        </label>
                                        <input
                                            {...register('confirm_password')} 
                                            type="password"
                                            autoComplete="off"
                                            className="input"
                                        />
                                        <div className="text-red-500 text-sm pt-1">{errors?.confirm_password && errors?.confirm_password?.message}</div>
                                    </div>

                                   
                                </div>
                                <div className="mt-5">
                                    <label className="block text-sm font-medium text-gray-700">
                                        Date Hired
                                    </label>
                                    <input 
                                        {...register('date_hired')} 
                                        defaultValue={dayjs(new Date()).format('YYYY-MM-DD')}
                                        type="date" 
                                        className="input !w-[200px]" />
                                    <div className="text-red-500 text-sm pt-1">{errors?.date_hired && errors?.date_hired?.message}</div>
                                </div>
                            </div>
                            <div className="bg-gray-50 px-4 py-3 text-right sm:px-6">
                            <button
                                disabled={status.loading}
                                type="submit"
                                className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Save
                            </button>
                            </div>
                        </div>
                    </form>
                </div>
                </div>
            </div>
        </AdminLayout>
    )
}
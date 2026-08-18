'use client';
import React from 'react';
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ErrorMsg from '../error-msg';
const schema = yup.object().shape({
    name: yup.string().required().label("Name"),
    subject: yup.string().required().label("subject"),
    message: yup.string().required().label("Message"),
});
export default function ContactForm({ btnCls = '' }) {
    const { register, handleSubmit, reset, formState: { errors } } = useForm({
        resolver: yupResolver(schema),
    });
    const onSubmit = handleSubmit((data) => {
        alert(JSON.stringify(data));
        reset();
    });
    return (<form onSubmit={onSubmit}>
      <div className="cn-contactform-input mb-25">
        <label>Name</label>
        <input id='name' {...register("name")} type="text" placeholder="John Doe"/>
        <ErrorMsg msg={errors.name?.message}/>
      </div>
      <div className="cn-contactform-input mb-25">
        <label>Subject</label>
        <input id='subject' {...register("subject")} type="text" placeholder="Your@email.com"/>
        <ErrorMsg msg={errors.subject?.message}/>
      </div>
      <div className="cn-contactform-input mb-25">
        <label>Message</label>
        <textarea id='message' {...register("message")} placeholder="Tell Us About Your Project"></textarea>
        <ErrorMsg msg={errors.message?.message}/>
      </div>
      <div className="cn-contactform-btn">
        <button className={`tp-btn-black-md ${btnCls} w-100`} type="submit">
          Send Message
        </button>
      </div>
    </form>);
}

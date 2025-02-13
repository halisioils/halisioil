"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import React, { useState } from "react";
import { type FieldValues, useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { sendEmail } from "~/actions/resend";
import { contactSchema } from "~/lib/types";
import LoadingComponent from "~/utils/LoadingComponent";

const ContactForm = () => {
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const [charCount, setCharCount] = useState<number>(0);
  const maxCharacterCount = 500;

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (dataValue: FieldValues) => {
    // Explicitly ensure the types
    const name = String(dataValue.name);
    const message = String(dataValue.message);
    const email = String(dataValue.email);

    // Call the server action directly
    const res = await sendEmail(name, message, email);

    if (!res.success) {
      setErrorMessage("Failed to send the message, please try again later.");
      return;
    }

    toast.success("Message sent successfully! 🎉✨");

    reset();
    setErrorMessage(null);
  };

  return (
    <section className="mb-8 w-[100%]">
      {errorMessage && (
        <p className="my-4 w-full rounded bg-red-100 p-2 text-center text-sm text-red-500">
          {errorMessage}
        </p>
      )}
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-4">
          <label>Your Name</label>
          <input
            type="text"
            placeholder="Please enter your name"
            className="mt-2 w-full rounded bg-transparent focus:outline-none"
            {...register("name", { required: "Name is required" })}
          />
          {errors.name?.message && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.name.message === "string"
                ? errors.name.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label>Email Address</label>
          <input
            type="email"
            placeholder="abc@def.com"
            className="mt-2 w-full rounded bg-transparent focus:outline-none"
            {...register("email", { required: "Email is required" })}
          />
          {errors.email?.message && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.email.message === "string"
                ? errors.email.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <div className="mb-4">
          <label>Message</label>
          <textarea
            className="mt-2 w-full rounded bg-transparent focus:outline-none"
            placeholder="Please enter your message here.."
            minLength={20}
            maxLength={maxCharacterCount} // Prevents extra characters at input level
            {...register("message", {
              required: "Message is required",
              validate: (value: string) =>
                value.length <= maxCharacterCount ||
                `Maximum ${maxCharacterCount} characters allowed.`,
            })}
            onInput={(event) => {
              const content = (event.target as HTMLTextAreaElement).value;
              if (content.length > maxCharacterCount) {
                // Prevent additional characters from being added
                (event.target as HTMLTextAreaElement).value = content.slice(
                  0,
                  maxCharacterCount,
                );
              }
              setCharCount(
                content.length > maxCharacterCount
                  ? maxCharacterCount
                  : content.length,
              );
            }}
          />
          <p className="mt-2 text-sm text-gray-500">
            {charCount} / {maxCharacterCount} characters
          </p>

          {errors.message?.message && (
            <p className="mt-1 text-sm text-red-500">
              {typeof errors.message.message === "string"
                ? errors.message.message
                : "Invalid input"}
            </p>
          )}
        </div>

        <button
          disabled={isSubmitting}
          type="submit"
          className={`flex h-[55px] w-[200px] items-center justify-center rounded bg-[#B88E2F] font-bold text-white hover:brightness-75 ${
            isSubmitting && "cursor-not-allowed"
          }`}
        >
          {isSubmitting ? <LoadingComponent /> : "Submit"}
        </button>
      </form>
    </section>
  );
};

export default ContactForm;

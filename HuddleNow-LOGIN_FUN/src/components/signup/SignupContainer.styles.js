import tw from "twin.macro";

export const Wrapper = tw.h1`
    text-3xl 
    font-bold
    underline
`;

export const Button = tw.button`
  bg-blue-500 
  hover:bg-blue-700 
  text-white 
  font-bold 
  py-2 
  px-4
  mt-6
  rounded
`;

export const HomeButton = tw(Button)`
  mt-8
`;

export const Row = tw.div`
  flex 
  flex-col
  w-1/5
`;


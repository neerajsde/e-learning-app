import ResetPassword from './components/ResetPassword';

const page = ({params}) => {
  return (
    <div>
      <ResetPassword token={params.token}/>
    </div>
  )
}

export default page;

export const metadata = {
  title: "Change Password | Study Notion",
  description: "Change Page",
};
import {PassLink} from "@Components/utils";
import {postData} from "@functions/request";
import {LoadingButton} from "@mui/lab";
import {TextField, Typography} from "@mui/material";
import {userRecoil} from "@recoil/user";
import LoginLayout from "@Screen/LoginLayout";
import {toast} from "material-react-toastify";
import {useRouter} from "next/router";
import {useCallback, useEffect, useState} from "react";
import {useRecoilState} from "recoil";

export default function Login() {
  const [loginUser, setLoginUser] = useState({
    username: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useRecoilState(userRecoil);
  const router = useRouter();
  const onChange = useCallback(
    (e) => setLoginUser({...loginUser, [e.target.name]: e.target.value}),
    [loginUser],
  );
  const handelSigIn = useCallback(
    async (e) => {
      try {
        e.preventDefault();
        setLoading(true);
        const res = await postData("http://localhost:5000/api/auth/login", loginUser);
        const data = await res.json();
        if (data.user) {
          setUser(data.user);
          localStorage.setItem("user", JSON.stringify(data.user));
          localStorage.setItem("token", data.user.token);
        }
        router.push("/dashboard", null, {shallow: true});
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(error.message);
      }
    },
    [loginUser, router, setUser],
  );

  useEffect(() => {
    if (user) router.push("/dashboard", null, {shallow: true});
  }, [router, user]);

  return (
    <LoginLayout title="Sign In">
      <form className="medium-margin-top flex-column medium-gap">
        <TextField
          name="username"
          value={loginUser.username}
          onChange={onChange}
          fullWidth
          label="Username \ Email Address"
        />

        <TextField
          name="password"
          value={loginUser.password}
          onChange={onChange}
          fullWidth
          label="Password"
          type="password"
        />

        <LoadingButton
          variant="contained"
          fullWidth
          type="submit"
          className="medium-padding"
          loading={loading}
          onClick={handelSigIn}
          disabled={Object.values(loginUser).some((item) => !item)}>
          Login
        </LoadingButton>

        <Typography variant="caption" color="GrayText">
          Need an Account ?{" "}
          <PassLink href={"/signup"}>
            <Typography variant="caption" color="#A2AEBB">
              Creat Now
            </Typography>
          </PassLink>
        </Typography>
      </form>
    </LoginLayout>
  );
}

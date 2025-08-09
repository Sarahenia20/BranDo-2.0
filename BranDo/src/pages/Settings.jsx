import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import HomeImg from "../assets/images/home-img.png";
import { useStateContext } from "../context/ContextProvider"; // Import context for user state

const Settings = () => {
  const { userToken } = useStateContext(); // Access the user token from context
  const navigate = useNavigate();

  useEffect(() => {
    if (!userToken) {
      navigate('/signup'); // Redirect to signup if no userToken is found
    }
  }, [userToken, navigate]);

  return (
    <div
      className="h-screen w-full text-gray-900"
      style={{
        background: "linear-gradient(135deg, #FFC0CB 50%, #66a6ff 50%)",
        backgroundSize: "200% 200%",
        animation: "gradientAnimation 15s ease infinite",
      }}
    >
      <br/> <br/> <br/> <br/>
      {/* ==== HOME SECTION ===== */}
      <section className="home grid h-screen pt-32 pb-16">
        <div className="home__container container grid content-center gap-12 lg:max-w-5xl lg:grid-cols-2 lg:items-center">
          <div className="home__data justify-self-center text-center lg:text-left">
            <p className="pb-2 font-semibold">Error 404</p>
            <h1 className="pb-4 text-5xl font-bold lg:text-6xl">Hey Buddy</h1>
            <p className="pb-8 font-semibold">
              We can't seem to find the page <br />
              you are looking for.
            </p>
            <a
              href="/main"
              className="inline-flex items-center justify-center rounded-full bg-gray-900 py-4 px-8 font-bold text-white"
            >
              Go Home
            </a>
          </div>

          <div className="home__img justify-self-center">
            <img
              src={HomeImg}
              className="w-64 lg:w-[400px] animate-floting"
              alt="home image"
            />
            <div className="home__shadow mx-auto h-8 w-36 lg:w-64 animate-shadow rounded-[50%] bg-gray-900/30 blur-md"></div>
          </div>
        </div>
      </section>

      {/* Add the keyframes for the gradient and floating animation */}
      <style jsx>{`
        @keyframes gradientAnimation {
          0% {
            background-position: 0% 50%;
          }
          50% {
            background-position: 100% 50%;
          }
          100% {
            background-position: 0% 50%;
          }
        }

        @keyframes floating {
          0% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(0);
          }
        }

        .animate-floting {
          animation: floating 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}

export default Settings;

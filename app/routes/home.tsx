import { Link } from "react-router";

export default function Home() {
    return (
      <p>
        This is a demo for React Router.
        <br />
        <Link to='/about'>About</Link>
      </p>
    );
  }
  
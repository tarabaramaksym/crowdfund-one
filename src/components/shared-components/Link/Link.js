import { useMatch, useResolvedPath, Link } from "react-router-dom";

function CustomLink({ children, to, ...props }) {
  let resolved = useResolvedPath(to);
  let match = useMatch({ path: resolved.pathname, end: true });

  return (

    <Link
      to={to}
      className={props.className || "btn menu-btn" + (match ? " active" : '')}
      {...props}
    >
      {children}
    </Link>


  );
}

export default CustomLink;
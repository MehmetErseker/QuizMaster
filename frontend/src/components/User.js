function User(props) {
  return (
    <li>
      {props.user.username}: 
      <a href={`mailto:${props.user.email}`}>{props.user.email}</a>
    </li>
  );
}

export default User;
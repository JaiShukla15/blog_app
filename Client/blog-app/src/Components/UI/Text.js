const Text = ({ type, name, keyPressHandler }) => {
    const handleSearch = (event)=>{
        keyPressHandler(event.target.value);
    }
  return (
    <>
      <div className="text-center">
        <input type={type} name={name} onChange={handleSearch} />
      </div>
    </>
  );
};
export default Text;

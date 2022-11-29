import "./PersonalityGame.css";





function PersonalityGame(props) {
    const testText = props.testText;
    return (
        <div>
            <h1>Hallo {testText} !</h1>
            <div>
                <label>
                    Gib eine kurze wahre Aussage über Dich ein:
                </label>

                <form>
                    <center>
                        <input type="text" name="name" placeholder="Lustiger Fakt"/>
                    </center>
                        <input type="submit" value="Submit" />
                </form>
            </div>
        </div>
    );
}


export default PersonalityGame;
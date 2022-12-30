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
                        <input type="text" name="name" placeholder="Lustiger Fakt" className="input-text"/>
                    </center>
                        <input type="submit" value="Submit" className="input-submit"/>
                </form>
            </div>
        </div>
    );
}


export default PersonalityGame;
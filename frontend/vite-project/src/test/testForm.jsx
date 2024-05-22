import axios from 'axios';
import React, { useState, useEffect } from 'react';
import {getCookie} from '../utils';

function TestForm() {
    const [typedMessage, setTypedMessage] = useState("");
    const [bidenCount, setBidenCount] = useState(0);
    const [trumpCount, setTrumpCount] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        getVoteNum();
    }, []);

    const handleInputChange = (e) => {
        setTypedMessage(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        postVote();
    };

    const postVote = () => {
        const csrftoken = getCookie('csrftoken');
        const config = {
            headers: {
                'X-CSRFToken': csrftoken
            },
            withCredentials: true
        };
        axios.post('http://localhost:8000/api/test/post-vote', {
            vote: typedMessage
        }, config)
        .then((response) => {
            getVoteNum();
        })
        .catch((error) => {
            setError("An error occurred: " + error.message);
        });
    };

    const getVoteNum = () => {
        axios.get('http://localhost:8000/api/test/get-vote')
        .then((response) => {
            setBidenCount(response.data.biden_count);
            setTrumpCount(response.data.trump_count);
        })
        .catch((error) => {
            setError("An error occurred: " + error.message);
        });
    };

    return (
        <div>
            <h1>Test Form: Vote for Biden or Trump!</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={typedMessage}
                    onChange={handleInputChange}
                    placeholder="Type 'Biden' or 'Trump'"
                />
                <button type="submit">Submit Vote</button>
            </form>
            <p>Biden Count: {bidenCount}</p>
            <p>Trump Count: {trumpCount}</p>
            {error && <p style={{color: 'red'}}>{error}</p>}
        </div>
    );
}

export default TestForm;

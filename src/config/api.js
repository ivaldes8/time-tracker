import axios from "axios";

const token = "16e2f0694a311151c01aa0a131b94a5a3ad7f110e12c2d8f459fcbb158214f5f";


const baseUrl = "https://api-test.sesametime.com/schedule/v1"

const api = async (url, method, body = null) => {
    let response = null;
    let error = null;
    axios.defaults.headers.common = {'Authorization': `Bearer ${token}`}
    await axios[method](`${baseUrl}/${url}`, body)
        .then((res) => {
            console.log(res,"Response")
            response = res.data;
        })
        .catch((e) => {
            console.log(e, 'Err')
            error =
                e.response && e.response.data && e.response.data.error
                    ? e.response.data.error.message
                    : e.message
                        ? e.message
                        : "Whoops! Something went wrong.";
        });

    return [response, error];
};

export default api;

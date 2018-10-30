const form = document.getElementById("gundam-vote-form");

form.addEventListener('submit', submitVote);

function submitVote(event){
    if(!$("input[name='gundam']:checked").val()){
        return false;
    }
    else{
        const choice = $("input[name='gundam']:checked").val();
        console.log(choice);

        const data = {gundam: choice};

        fetch('http://localhost:5000/poll',
            {
                method: 'post',
                body: JSON.stringify(data),
                headers: new Headers({
                    'Content-Type': 'application/json'
                })
            }
        )
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(err => console.log(err));


        //event.preventDefault();
    }
}

let voteCount = {
    Exia: 0,
    Barbatos: 0,
    Unicorn: 0,
    RX78: 0
}

let dataPoints = [
    {label: 'Exia', y: voteCount.Exia},
    {label: 'Barbatos', y: voteCount.Barbatos},
    {label: 'Unicorn', y: voteCount.Unicorn},
    {label: 'RX78', y: voteCount.RX78}
];

function fecthDataFromMongo(){
    fetch('http://localhost:5000/poll')
        .then(res => res.json())
        .then(data => {
            const votes = data.votes;
            const totalVotes = votes.length;
            votes.forEach(element => {
                voteCount[element.gundam] += parseInt(element.points); 
            });
            dataPoints = [
                {label: 'Exia', y: voteCount.Exia},
                {label: 'Barbatos', y: voteCount.Barbatos},
                {label: 'Unicorn', y: voteCount.Unicorn},
                {label: 'RX78', y: voteCount.RX78}
            ];
            showChart(totalVotes);
        })
        .catch(err => console.log(err));
}

fecthDataFromMongo();


const chartContainer = document.getElementById("chartContainer");

function showChart(totalVotes){
    if(chartContainer){
        const chart = new CanvasJS.Chart('chartContainer', {
            animationEnabled: true,
            theme: 'theme1',
            title: {
                text: `Total Votes ${totalVotes}`
            },
            data: [
                {
                    type: 'column',
                    dataPoints: dataPoints
                }
            ]
        });
    
        chart.render();    
    
        var pusher = new Pusher('d14e6103c99c8f9c219c', {
            cluster: 'us2',
            forceTLS: true
        });
      
        var channel = pusher.subscribe('poll');
        channel.bind('vote', function(data) {
            dataPoints = dataPoints.map(elem => {
                if(elem.label == data.gundam){
                    elem.y += data.points;
                    return elem;
                }
                else{
                    return elem;
                }
            });
            chart.render();
        });
    }    
}


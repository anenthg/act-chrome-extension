var packages = [
    {'name': 'ACT Freedom', 'data': 20},
    {'name': 'ACT Liberty', 'data': 30},
    {'name': 'ACT Privilege', 'data': 40},
    {'name': 'ACT Abundant', 'data': 50},
    {'name': 'ACT Indulge', 'data': 60},
    {'name': 'ACT Extravagant', 'data': 100},
    {'name': 'ACT Force', 'data': 200},
    {'name': 'ACT BB HO Value', 'data': 250},
    {'name': 'ACT BB HO Extra', 'data': 350}
],
    usage, // Total usage, in GigaBytes
    package, // Users's package -> one among the list

    usageHandler,
    packageHandler,
    render,
    onError;

render = function (n) {
    if (!usage || !package) {
        return false;
    }

    document.body.classList.remove("loading");

    var consumed = document.getElementById("consumed"),
        fup = document.getElementById("fup"),
        bbMeter = document.getElementById("bb-meter");

    consumed.innerHTML = usage;
    fup.innerHTML = package.data + ' GB';
    bbMeter.innerHTML = (((package.data - usage) / package.data) * 100).toFixed(2) + "%";

    return this;
},

onError = function () {
    document.body.classList.add("error");
};

// Find and update user's package.
packageHandler = new XMLHttpRequest();
packageHandler.open("GET", "http://portal.acttv.in/index.php/mypackage", true);
packageHandler.onreadystatechange = function () {
    var div, t;

    if (this.readyState != 4) {
        return this;
    }

    if (this.status !== 200) {
        return onError("Something went wrong");
    }

    div = document.createElement("div");
    div.innerHTML = this.responseText;

    t = div
        .querySelector(".moduletable tr:nth-child(3) td:nth-child(3)")
        .textContent
        .trim();

    package = packages.filter(function (f) {
        return (f.name.toUpperCase() === t);
    })[0];

    return render();
};
packageHandler.send();

// Find and update current usage
usageHandler = new XMLHttpRequest();
usageHandler.open("GET", "http://portal.acttv.in/index.php/myusage", true);
usageHandler.onreadystatechange = function () {
    var div, t;

    if (this.readyState != 4) {
        return this;
    }

    if (this.status !== 200) {
        return onError("Something went wrong");
    }

    div = document.createElement("div");
    div.innerHTML = this.responseText;

    t = div
        .querySelector("#total td:nth-child(2)")
        .textContent
        .replace("GB", '');

    usage = parseFloat(t, 10);

    return render();
};
usageHandler.send();

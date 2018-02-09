
chars = ['1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']
codes = [];
naughtyWords = ['fuck', 'shit', 'bitch', 'damn', 'ass', 'hell', 'cunt', 'cum', 'tit', 'fat', 'fag', 'chub', 'dick', 'cock', 'slut', 'pee', 'poo', 'ugly', 'gay', 'anus', 'piss', 'butt', 'lard', 'ahole', 'anal', 'bltch', 'babe', 'balls', 'bang', 'barf', 'beer', 'beotch', 'bimbo', 'blow', 'boink', 'bone', 'boob', 'booty', 'booze', 'bung', 'c0ck', 'caca', 'chode', 'clit', 'coon', 'crap', 'dike', 'dildo', 'dong', 'dyke', 'erect', 'fart', 'felch', 'gook', 'gspot', 'gtfo', 'homo', 'jap', 'jiz', 'kike', 'lez', 'lube', 'meth', 'mofo', 'nad', 'nazi', 'oral', 'ovum', 'pedo', 'pimp', 'poon', 'puss', 'rape', 'scum', 'sex', 'spic', 'sperm', 'stfu', 'tard', 'suck', 'toke', 'turd', 'twat', 'vag', 'hag'];
dupes = 0;
naughtyCount = 0;
tooManyBadWords = false;

function spin(canContinue) {
    if (codes.length >= 1) {
        reset('partial');
    }
    let gear = document.getElementById('gear'),
    gear2 = document.getElementById('gear2');
    if (canContinue) {
        gear.classList.add('spin');
        gear2.classList.add('spin');
        setTimeout(function() {
            randomize();
        }, 500);
    } else {
        gear.classList.remove('spin');
        gear2.classList.remove('spin');
    }
}

function randomize() {
    let gear = document.getElementById('gear'),
    gear2 = document.getElementById('gear2'),
    numCodes = document.getElementById('codeNumber').value,
    countStatus = document.getElementById('countStatus'),
    dupeStatus = document.getElementById('dupeStatus'),
    naughtyStatus = document.getElementById('naughtyStatus'),
    intNumCodes = parseInt(numCodes),
    tooManyDupes = false;
    if (intNumCodes > 0) {
        for (let j = 0; j < intNumCodes; j++) {
            completeCode = addNewCode();
            if (completeCode !== null) {
                codes.push(completeCode.toUpperCase());
            }
        }
        let sortedCodes = codes.slice().sort();
        sortedCodes.map((c, s) => {
            if (sortedCodes[s + 1] == sortedCodes[s] && sortedCodes[s + 2] == sortedCodes[s] && sortedCodes[s + 3] == sortedCodes[s]) {
                    tooManyDupes = true;
                } else if (sortedCodes[s + 1] == sortedCodes[s] && sortedCodes[s + 2] == sortedCodes[s]) {
                    sortedCodes.splice(s, 2);
                    dupes++;
                } else if (sortedCodes[s + 1] == sortedCodes[s]) {
                    sortedCodes.splice(s, 1);
                    dupes++;
                }
        })
        if (tooManyBadWords) {
            gear.classList.remove('spin');
            gear2.classList.remove('spin');
            document.getElementById('codeCount').innerHTML = 'At least 1 banned word was generated even after shuffling each letter around three times. Cut your losses and try again.'
            countStatus.classList.add('led-red');
        } else if (tooManyDupes) {
            gear.classList.remove('spin');
            gear2.classList.remove('spin');
            document.getElementById('codeCount').innerHTML = 'More than 3 of the same code generated. Consider decreasing the amount of codes or increasing the characters in each code.'
            countStatus.classList.add('led-red');
        } else {
            document.getElementById('codeCount').innerHTML = 'Successfully generated ' + sortedCodes.length + ' codes!';
            document.getElementById('dupeCount').innerHTML = dupes + ' duplicate(s) found and removed.';
            document.getElementById('naughtyCount').innerHTML = naughtyCount + ' banned words found and sanitized.';
            if (dupes > 0) {
                dupeStatus.classList.add('led-yellow');
                countStatus.classList.add('led-yellow');
            } else {
                dupeStatus.classList.add('led-green');
                countStatus.classList.add('led-green');
            }
            if (naughtyCount > 0) {
                naughtyStatus.classList.add('led-yellow');
            } else {
                naughtyStatus.classList.add('led-green');
            }
            let codeBox = document.getElementById('codeBox');
            let prefix = document.getElementById('codePrefix').value;
            if (prefix) {
                sortedCodes = sortedCodes.map(code => {
                    return prefix + code;
                })
            }
            codeBox.innerHTML = sortedCodes.join(", ");
            codeBox.style.display = "block"
            document.getElementById('copyButton').style.display = 'block';
            gear.classList.remove('spin');
            gear2.classList.remove('spin');
        }
    } else {
        spin(false);
    }
}

function addNewCode() {
    let newCode = [],
    lengthCodes = document.getElementById('codeLength').value,
    intLengthCodes = parseInt(lengthCodes);

    if (intLengthCodes > 0) {
        for (let i = 0; i < intLengthCodes; i++) {
            let charIndex = Math.floor(Math.random() * chars.length),
            eachChar = chars[charIndex];
            newCode.push(eachChar);
        }
        let completeCode = newCode.join("");
        naughtyWords.map((c, n) => {
            let substring = naughtyWords[n];
            if (completeCode.indexOf(substring) !== -1) {
                naughtyCount++;
                completeCode = shuffle(completeCode);
                //if there are still bad words after shuffling
                if (completeCode.indexOf(substring) !== -1) {
                    completeCode = shuffle(completeCode);
                    //if there are STILL bad words after shuffling (yes, it happens)
                    if (completeCode.indexOf(substring) !== -1) {
                        completeCode = shuffle(completeCode);
                        //if still bad words, cut your losses and try again
                        if (completeCode.indexOf(substring) !== -1) {
                            tooManyBadWords = true;
                            return null;
                        }
                    }
                }
            }
        })
        return completeCode;
    } else {
        return null;
    }
}

function shuffle(badWord) {
    let cleansedWord = badWord.split(""),
        wordLength = cleansedWord.length;
    
    for (let t = wordLength -1; t > 0; t--) {
        let randorder = Math.floor(Math.random() * (t + 1)),
        tmp = cleansedWord[t];
        cleansedWord[t] = cleansedWord[randorder];
        cleansedWord[randorder] = tmp;
    }
    return cleansedWord.join("");
}

function reset(type) {
    codes = [];
    document.getElementById('codeBox').innerHTML = '';
    document.getElementById('codeBox').style.display = 'none';
    document.getElementById('codeCount').innerHTML = '';
    document.getElementById('dupeCount').innerHTML = '';
    document.getElementById('naughtyCount').innerHTML = '';
    document.getElementById('copyButton').style.display = 'none';
    document.getElementById('countStatus').className = 'col-xs-1';
    document.getElementById('dupeStatus').className = 'col-xs-1';
    document.getElementById('naughtyStatus').className = 'col-xs-1';
    dupes = 0;
    naughtyCount = 0;
    tooManyBadWords = false;
    
    if (type === 'full') {
            document.getElementById('codeLength').value = '';
            document.getElementById('codeNumber').value = '';
            document.getElementById('codePrefix').value = '';
    }
}

function copy() {
    document.getElementById('codeBox').select();
    document.execCommand('copy');
}
// Terminal functionality for About page
document.addEventListener('DOMContentLoaded', function() {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    
    if (!terminalInput || !terminalOutput) return;
    
    // Command history
    let commandHistory = [];
    let historyIndex = -1;
    
    // Available commands
    const commands = {
        help: {
            description: 'Display available commands',
            action: function() {
                return `Available commands:
                
<span style="color: var(--text-primary)">help</span>      - Display this help message
<span style="color: var(--text-primary)">whoami</span>    - Display current user
<span style="color: var(--text-primary)">education</span> - View my education background
<span style="color: var(--text-primary)">skills</span>    - View my technical skills
<span style="color: var(--text-primary)">banner</span>    - Display ASCII banner
<span style="color: var(--text-primary)">ping</span>      - Ping a host (usage: ping [host])
<span style="color: var(--text-primary)">nmap</span>      - Scan a host (usage: nmap [host])
<span style="color: var(--text-primary)">whois</span>     - Whois lookup (usage: whois [domain])
<span style="color: var(--text-primary)">clear</span>     - Clear the terminal

Type any command to get started!`;
            }
        },
        skills: {
            description: 'Technical skills',
            action: function() {
                // Helper function to generate progress bar and rank
                const getSkillBar = (name, percentage) => {
                    const barLength = 30;
                    const filled = Math.round((percentage / 100) * barLength);
                    const empty = barLength - filled;
                    const bar = '█'.repeat(filled) + '░'.repeat(empty);
                    
                    // Determine rank based on percentage
                    let rank, rankColor;
                    if (percentage >= 70) {
                        rank = 'Hacker';
                        rankColor = '#ff0051'; // Neon pink
                    } else if (percentage >= 40) {
                        rank = 'Pro';
                        rankColor = '#00d9ff'; // Cyan
                    } else {
                        rank = 'Noob';
                        rankColor = '#ffbd2e'; // Yellow
                    }
                    
                    return `<div style="margin-bottom: 0.3rem;">
  <div style="display: flex; justify-content: space-between; margin-bottom: 0.1rem;">
    <span style="color: var(--text-primary); font-weight: bold;">${name}</span>
    <span style="color: ${rankColor}; font-weight: bold;">[${rank}]</span>
  </div>
  <div style="display: flex; align-items: center; gap: 1rem;">
    <div style="flex: 1; font-family: monospace;">
      <span style="color: var(--text-primary);">${bar}</span>
    </div>
    <span style="color: var(--text-secondary); font-weight: bold; min-width: 45px;">${percentage}%</span>
  </div>
</div>`;
                };
                
                return `<span style="color: var(--text-secondary); font-weight: bold; font-size: 1.1rem;">Technical Skills</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

${getSkillBar('Communication', 65)}
${getSkillBar('Programming Skills', 60)}
${getSkillBar('Linux', 50)}
${getSkillBar('Penetration Testing', 65)}
${getSkillBar('Web Pentesting', 50)}
${getSkillBar('Reverse Engineering', 40)}
${getSkillBar('Pwn', 27)}
${getSkillBar('Forensics', 50)}
${getSkillBar('Cryptography', 30)}
${getSkillBar('OSINT', 40)}
${getSkillBar('Misc', 50)}

<span style="color: #ffbd2e;">⚡ Noob</span>: 0-39% | <span style="color: #00d9ff;">⚡ Pro</span>: 40-69% | <span style="color: #ff0051;">⚡ Hacker</span>: 70-100%`;
            }
        },
        education: {
            description: 'Education background',
            action: function() {
                return `<span style="color: var(--text-secondary); font-weight: bold; font-size: 1.1rem;">Education Background</span>
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<span style="color: var(--text-primary); font-weight: bold;">🎓 College</span>
<span style="color: var(--text-secondary);">Romblon State University - Main Campus</span>
   📍 Brgy. Liwanag, Odiongan, Romblon
   📅 August 2020 - July 2027
   🎯 Bachelor of Science in Information Technology

<span style="color: var(--text-primary); font-weight: bold;">🎓 Senior High School</span>
<span style="color: var(--text-secondary);">Odiongan National High School</span>
   📍 Brgy. Dapawan, Odiongan, Romblon
   📅 June 2018 - March 2020
   💻 TVL-ICT Track

<span style="color: var(--text-primary); font-weight: bold;">🎓 Secondary School</span>
<span style="color: var(--text-secondary);">Odiongan National High School</span>
   📍 Brgy. Dapawan, Odiongan, Romblon
   📅 June 2014 - March 2018
   🏆 Special Science Class (SSC) Student

<span style="color: var(--text-primary); font-weight: bold;">🎓 Primary School</span>
<span style="color: var(--text-secondary);">Rizal Elementary School</span>
   📍 Brgy. Rizal, Odiongan, Romblon
   📅 June 2011 - March 2014`;
            }
        },
        whoami: {
            description: 'Display current user',
            action: function() {
                return `<div style="display: flex; gap: 3rem; align-items: flex-start;">
    <div style="color: var(--text-primary); font-family: monospace; white-space: pre; line-height: 1.1; flex-shrink: 0;">
 /$$   /$$  /$$$$$$   /$$$$$$ 
|__/  /$$/ /$$$_  $$ /$$$_  $$
     /$$/ | $$$$\\ $$| $$$$\\ $$
    /$$/  | $$ $$ $$| $$ $$ $$
   /$$/   | $$\\ $$$$| $$\\ $$$$
  /$$/    | $$ \\ $$$| $$ \\ $$$
 /$$/  /$$|  $$$$$$/|  $$$$$$/
|__/  |__/ \\______/  \\______/
    </div>
    <div style="flex: 1; white-space: pre-wrap;">
<span style="color: var(--text-primary); font-weight: bold;">Last Name</span> : Enad
<span style="color: var(--text-primary); font-weight: bold;">First Name</span> : Van Glenndon
<span style="color: var(--text-primary); font-weight: bold;">Middle Name</span> : Familara
<span style="color: var(--text-primary); font-weight: bold;">Pseudonym</span> : Zor0ark
<span style="color: var(--text-primary); font-weight: bold;">Birthday</span> : September 2, 2001
<span style="color: var(--text-primary); font-weight: bold;">Age</span> : 24
<span style="color: var(--text-primary); font-weight: bold;">Fav Language</span> : Python
<span style="color: var(--text-primary); font-weight: bold;">Fav Distro</span> : Kali Linux, Ubuntu, Parrot OS
<span style="color: var(--text-primary); font-weight: bold;">Fav CTF</span> : Reverse Engineering, Pwn, Exploit (Boot2Root), Forensics
    </div>
</div>

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

<span style="color: var(--text-secondary); font-weight: bold;">A self taught with a lot of interest in Cybersecurity</span>

Hi, I am Van, a 24 years old located in Odiongan, Romblon, Philippines. My interest 
has always been in Cyber Security. I want to ensure that security is our top priority 
within our quickly developing world and would like to contribute to a more secure 
environment.

I like to keep myself relevant by solving Capture The Flags and following the latest 
IT developments that's why I always participate in any online CTF events. I also keep 
myself busy by listening to programming, creating CTF challenges and listening to 
podcasts like Darknet Diaries. I would like to improve myself within the Cybersecurity 
field in order to become a Cybersecurity expert both on Red Teaming and Blue Teaming. 
I always keep a close eye to newly discovered vulnerabilities and like to challenge 
myself with unsolved weaknesses. I am someone who wants to make the world a more secure 
place for the next generation, even if it goes unnoticed.`;
            }
        },
        banner: {
            description: 'Display ASCII banner',
            action: function() {
                return `<span style="color: var(--text-primary)">
 ███████╗ ██████╗ ██████╗  ██████╗  █████╗ ██████╗ ██╗  ██╗
 ╚══███╔╝██╔═══██╗██╔══██╗██╔═████╗██╔══██╗██╔══██╗██║ ██╔╝
   ███╔╝ ██║   ██║██████╔╝██║██╔██║███████║██████╔╝█████╔╝ 
  ███╔╝  ██║   ██║██╔══██╗████╔╝██║██╔══██║██╔══██╗██╔═██╗ 
 ███████╗╚██████╔╝██║  ██║╚██████╔╝██║  ██║██║  ██║██║  ██╗
 ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
</span>
<span style="color: var(--text-secondary)">  CTF Player | Cybersecurity Researcher | Ethical Hacker</span>`;
            }
        },
        clear: {
            description: 'Clear terminal',
            action: function() {
                terminalOutput.innerHTML = '';
                return null;
            }
        },
        ping: {
            description: 'Ping a host',
            action: function(args) {
                if (!args || args.length === 0) {
                    return `<span style="color: #ff0051;">Usage: ping [host]</span>
Example: ping google.com`;
                }
                
                const host = args[0];
                const packets = 4;
                let output = `PING ${host} (${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}) 56(84) bytes of data.\n`;
                
                for (let i = 0; i < packets; i++) {
                    const time = (Math.random() * 50 + 10).toFixed(1);
                    const ttl = Math.floor(Math.random() * 10) + 54;
                    output += `64 bytes from ${host}: icmp_seq=${i + 1} ttl=${ttl} time=${time} ms\n`;
                }
                
                output += `\n--- ${host} ping statistics ---\n`;
                output += `${packets} packets transmitted, ${packets} received, 0% packet loss, time ${packets - 1}ms\n`;
                const avg = (Math.random() * 50 + 15).toFixed(3);
                output += `rtt min/avg/max/mdev = ${(parseFloat(avg) - 5).toFixed(3)}/${avg}/${(parseFloat(avg) + 10).toFixed(3)}/2.${Math.floor(Math.random() * 999)} ms`;
                
                return `<span style="color: var(--text-secondary);">${output}</span>`;
            }
        },
        nmap: {
            description: 'Scan a host',
            action: function(args) {
                if (!args || args.length === 0) {
                    return `<span style="color: #ff0051;">Usage: nmap [host]</span>
Example: nmap scanme.nmap.org`;
                }
                
                const host = args[0];
                const ip = `${Math.floor(Math.random() * 223) + 1}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
                
                const commonPorts = [
                    { port: 22, service: 'ssh', version: 'OpenSSH 8.2p1' },
                    { port: 80, service: 'http', version: 'Apache httpd 2.4.41' },
                    { port: 443, service: 'https', version: 'nginx 1.18.0' },
                ];
                
                let output = `Starting Nmap 7.94 ( https://nmap.org ) at ${new Date().toUTCString()}\n`;
                output += `Nmap scan report for ${host} (${ip})\n`;
                output += `Host is up (0.${Math.floor(Math.random() * 99) + 10}s latency).\n`;
                output += `Not shown: 997 filtered ports\n\n`;
                output += `PORT     STATE SERVICE    VERSION\n`;
                
                commonPorts.forEach(p => {
                    output += `${p.port}/tcp  open  ${p.service.padEnd(10)} ${p.version}\n`;
                });
                
                output += `\nNmap done: 1 IP address (1 host up) scanned in ${(Math.random() * 5 + 2).toFixed(2)} seconds`;
                
                return `<span style="color: var(--text-secondary);">${output}</span>`;
            }
        },
        whois: {
            description: 'Whois lookup',
            action: function(args) {
                if (!args || args.length === 0) {
                    return `<span style="color: #ff0051;">Usage: whois [domain]</span>
Example: whois example.com`;
                }
                
                const domain = args[0];
                
                let output = `\n   Domain Name: ${domain.toUpperCase()}\n`;
                output += `   Registry Domain ID: ${Math.random().toString(36).substr(2, 9).toUpperCase()}_DOMAIN_COM-VRSN\n`;
                output += `   Registrar WHOIS Server: whois.registrar.example\n`;
                output += `   Registrar URL: http://www.registrar.example\n`;
                output += `   Updated Date: ${new Date().toISOString().split('T')[0]}T${Math.floor(Math.random() * 24)}:${Math.floor(Math.random() * 60)}:${Math.floor(Math.random() * 60)}Z\n`;
                output += `   Creation Date: 2020-01-15T10:30:00Z\n`;
                output += `   Registry Expiry Date: 2025-01-15T10:30:00Z\n`;
                output += `   Registrar: Example Registrar, Inc.\n`;
                output += `   Registrar IANA ID: 123456\n`;
                output += `   Registrar Abuse Contact Email: abuse@registrar.example\n`;
                output += `   Registrar Abuse Contact Phone: +1.5555551234\n`;
                output += `   Domain Status: clientTransferProhibited\n`;
                output += `   Name Server: NS1.EXAMPLE.COM\n`;
                output += `   Name Server: NS2.EXAMPLE.COM\n`;
                output += `   DNSSEC: unsigned\n`;
                
                return `<span style="color: var(--text-secondary);">${output}</span>`;
            }
        }
    };
    
    // Display welcome message
    function displayWelcome() {
        const banner = `<span style="color: var(--text-primary)">
 ███████╗ ██████╗ ██████╗  ██████╗  █████╗ ██████╗ ██╗  ██╗
 ╚══███╔╝██╔═══██╗██╔══██╗██╔═████╗██╔══██╗██╔══██╗██║ ██╔╝
   ███╔╝ ██║   ██║██████╔╝██║██╔██║███████║██████╔╝█████╔╝ 
  ███╔╝  ██║   ██║██╔══██╗████╔╝██║██╔══██║██╔══██╗██╔═██╗ 
 ███████╗╚██████╔╝██║  ██║╚██████╔╝██║  ██║██║  ██║██║  ██╗
 ╚══════╝ ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝
</span>
<span style="color: var(--text-secondary)">  CTF Player | Cybersecurity Researcher | Ethical Hacker</span>

Welcome to my interactive terminal!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

Type <span style="color: var(--text-primary); font-weight: bold;">help</span> to see available commands.
`;
        addOutput(banner, 'terminal-response');
    }
    
    // Add output to terminal
    function addOutput(text, className = '') {
        const line = document.createElement('div');
        line.className = `terminal-line ${className}`;
        line.innerHTML = text;
        terminalOutput.appendChild(line);
        scrollToBottom();
    }
    
    // Scroll to bottom
    function scrollToBottom() {
        const terminalBody = document.querySelector('.terminal-body');
        terminalBody.scrollTop = terminalBody.scrollHeight;
    }
    
    // Process command
    function processCommand(input) {
        const parts = input.trim().split(/\s+/);
        const command = parts[0].toLowerCase();
        const args = parts.slice(1);
        
        // Add command to history
        if (input.trim()) {
            commandHistory.unshift(input.trim());
            historyIndex = -1;
        }
        
        // Display command
        addOutput(`<span class="terminal-prompt">zor0ark@nullbytez:~$ </span><span class="terminal-command">${input}</span>`);
        
        // Execute command
        if (!command) {
            return;
        }
        
        if (commands[command]) {
            const result = commands[command].action(args);
            if (result !== null) {
                addOutput(result, 'terminal-response');
            }
        } else {
            addOutput(`bash: ${command}: command not found`, 'terminal-error');
        }
    }
    
    // Handle input
    terminalInput.addEventListener('keydown', function(e) {
        if (e.key === 'Enter') {
            const input = terminalInput.value;
            processCommand(input);
            terminalInput.value = '';
        } else if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (historyIndex < commandHistory.length - 1) {
                historyIndex++;
                terminalInput.value = commandHistory[historyIndex];
            }
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex > 0) {
                historyIndex--;
                terminalInput.value = commandHistory[historyIndex];
            } else if (historyIndex === 0) {
                historyIndex = -1;
                terminalInput.value = '';
            }
        } else if (e.key === 'Tab') {
            e.preventDefault();
            const input = terminalInput.value.toLowerCase();
            const matches = Object.keys(commands).filter(cmd => cmd.startsWith(input));
            if (matches.length === 1) {
                terminalInput.value = matches[0];
            }
        }
    });
    
    // Keep focus on input
    document.querySelector('.terminal-body').addEventListener('click', function() {
        terminalInput.focus();
    });
    
    // Display welcome message on load
    displayWelcome();
});

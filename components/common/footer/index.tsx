/* eslint-disable react/jsx-no-comment-textnodes */
/* eslint-disable react/no-unescaped-entities */
import Link from 'next/link';
import { navigation } from '../navbar/navigation';


const IsraelFlagIcon = (props: any) => (
    <svg viewBox="0 0 24 24" {...props}>
     <svg viewBox="0 0 36 36" aria-hidden="true" role="img" preserveAspectRatio="xMidYMid meet" fill="#000000">
        <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
        <g id="SVGRepo_tracerCarrier" stroke-linecap="round" stroke-linejoin="round"></g>
        <g id="SVGRepo_iconCarrier">
        <path fill="#EDECEC" d="M20.666 19l-.467.809h.934zM18 21.618l.467-.809h-.934z"></path>
        <path fill="#EEE" d="M0 25h36V11H0v14zM.294 7.5h35.413A4 4 0 0 0 32 5H4A3.999 3.999 0 0 0 .294 7.5z"></path>
        <path fill="#EDECEC" d="M21.133 16.191h-.934l.467.809zm-5.332 0h-.934l.467.809zm3.243 3.618L20.089 18l-1.045-1.809h-2.088L15.911 18l1.045 1.809zM15.334 19l-.467.809h.934zM18 14.382l-.467.809h.934z"></path><path fill="#0038B8" d="M.294 7.5A3.982 3.982 0 0 0 0 9v2h36V9c0-.531-.106-1.036-.294-1.5H.294z"></path><path fill="#EEE" d="M.294 28.5h35.413A4 4 0 0 1 32 31H4a3.999 3.999 0 0 1-3.706-2.5z"></path><path fill="#0038B8" d="M.294 28.5A3.982 3.982 0 0 1 0 27v-2h36v2c0 .531-.106 1.036-.294 1.5H.294zm16.084-7.691L18 23.618l1.622-2.809h3.243L21.244 18l1.622-2.809h-3.243L18 12.382l-1.622 2.809h-3.243L14.756 18l-1.622 2.809h3.244zm1.622.809l-.467-.809h.934l-.467.809zm3.133-5.427l-.467.809l-.467-.808h.934zM20.666 19l.467.808h-.934l.467-.808zM18 14.382l.467.809h-.934l.467-.809zm-1.044 1.809h2.089L20.089 18l-1.044 1.809h-2.089L15.911 18l1.045-1.809zm-1.155 0l-.467.809l-.467-.808h.934zM15.334 19l.467.808h-.934l.467-.808z">
        </path>
        </g>
        </svg>
    </svg>
  );

const socialLinks = [
{
    name: 'Linkedin',
    href: 'https://www.linkedin.com/in/kazaz-or/',
    icon: (props: any) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
        fillRule="evenodd"
        d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.32 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.79M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
    </svg>
    ),
},
{
    name: 'Twitter',
    href: 'https://twitter.com/OrKazaz',
    icon: (props: any) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
    </svg>
    ),
},
{
    name: 'GitHub',
    href: 'https://github.com/Kazaz-Or',
    icon: (props: any) => (
    <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
        <path
        fillRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
        clipRule="evenodd"
        />
    </svg>
    ),
},
{
    name: 'BringThemHome',
    href: 'https://stories.bringthemhomenow.net',
    icon: (props: any) => (
      <div className="flex items-center">
        <span className="text-gray-400 hover:text-gray-500">#BringThemHome</span>
        <IsraelFlagIcon className="ml-2 h-6 w-6" aria-hidden="true" />
      </div>
    ),
}
]

function Copyright() {
    const smallFontStyle = { fontSize: "14px" };
return (
    <>
    <span style={smallFontStyle}>
    <Link legacyBehavior color="inherit" href="/">
        // Kazi's dev blog
    </Link>{' '}
    {new Date().getFullYear()} &copy;
    </span>
    </>
);
}

const Footer = () => {
return (
    <footer className="bg-gray-800">
    <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <nav className="-mx-5 -my-2 flex flex-wrap justify-center" aria-label="Footer">
        {navigation.map((item) => (
            <div key={item.name} className="px-5 py-2">
            <Link legacyBehavior href={item.href}>
                <a className="text-base text-gray-400 hover:text-gray-500">
                {item.name}
                </a>
            </Link>
            </div>
        ))}
        </nav>
        <div className="mt-8 flex justify-center space-x-6">
        {socialLinks.map((item) => (
            <a rel='noreferrer' target="_blank" key={item.name} href={item.href} className="text-gray-400 hover:text-gray-500">
            <span className="sr-only">{item.name}</span>
            <item.icon className="h-6 w-6" aria-hidden="true" />
            </a>
        ))}
        </div>
        <p className="mt-8 text-center text-base text-gray-400"><Copyright /></p>
    </div>
    </footer>
)
}

export default Footer;

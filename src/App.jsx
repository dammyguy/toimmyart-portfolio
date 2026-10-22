
import { useEffect, useRef, useState } from 'react';
import './App.css'
import useScrollReveal from "./useScrollReveal";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faArrowLeft,
  faArrowDown,
  faLocationDot,
  faFilePdf,
  faDownload,
  faEye,
  faArrowUpRightFromSquare,
  faBars,
  faXmark,
  faSun,
  faMoon,
} from '@fortawesome/free-solid-svg-icons';
import { faInstagram, faLinkedin, faTiktok, faWhatsapp } from '@fortawesome/free-brands-svg-icons';
import Swal from 'sweetalert2';

const Toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  didOpen: (toast) => {
    toast.addEventListener('mouseenter', Swal.stopTimer)
    toast.addEventListener('mouseleave', Swal.resumeTimer)
  }
});

const socialLinks = [
  { label: 'Instagram', href: 'https://www.instagram.com/Toimmyart_Studio/', icon: faInstagram },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/search/results/people/?keywords=Iretomiwa%20Timothy', icon: faLinkedin },
  { label: 'TikTok', href: 'https://www.tiktok.com/@toimmyart', icon: faTiktok },
  { label: 'WhatsApp', href: 'https://wa.me/2347062634004?text=Hi%20Toimmyart%20Studio%2C%20I%27d%20like%20to%20discuss%20a%20design%20project.', icon: faWhatsapp },
];

const projects = [
  {
    number: '01',
    title: 'Branding',
    category: 'Brand Identity',
    type: 'branding',
    style: 'project-orange',
    mark: 'BRAND',
    detail: 'STRATEGY. STORY. IMPACT.',
  },
  {
    number: '02',
    title: 'Social Media Graphics',
    category: 'Visual Content',
    type: 'social-media',
    style: 'project-purple',
    mark: 'GRAPHICS',
    detail: 'CONTENT THAT CLICKS.',
  },
]

const endWorkImages = [
  { src: '/end-work/29.png', alt: 'ToimmyArt selected end work, image 1' },
  { src: '/end-work/tomiiwall.png', alt: 'ToimmyArt selected end work, image 2' },
];

const folderImages = (category, folder, files) => files.map((file) =>
  '/projects/' + category + '/' + encodeURIComponent(folder) + '/' + encodeURIComponent(file),
);

const portfolioFolders = {
  branding: [
    { name: 'ADVIP', images: folderImages('brand', 'ADVIP', ['12.png', '13.png', '14.png']) },
    { name: 'AYCON', images: folderImages('brand', 'AYCON', ['7 (2).png', '8.png', '9.png', '18 (2).png']) },
    { name: 'BBB', images: folderImages('brand', 'BBB', ['16 (2).png', 'Bag Mockup 1.png']) },
    { name: 'KEN', images: folderImages('brand', 'KEN', ['15.png']) },
    { name: 'OGA GRILL', images: folderImages('brand', 'OGA GRILL', ['10.png', '11.png']) },
  ],
  'social-media': [
    { name: 'ACCA', images: folderImages('graphics', 'ACCA', ['26 (2).png', '26 (3).png']) },
    { name: 'BBB', images: folderImages('graphics', 'BBB', ['BBB new week.jpg', 'BILLBORD.png']) },
    { name: 'GG STORE', images: folderImages('graphics', 'GG STORE', ['0 upgrade.png', '1 upgrade.png', '2 upgrade.png', '3 upgrade.png', '4 upgrade.png', '5 upgrade.png', 'Friday April 3.png', 'Gadget Breathe.png', 'Holiday.png', 'Its march.png', 'Love Value.png', 'Mother.png', 'Right 1.png', 'Tip.png']) },
    { name: 'SDDG', images: folderImages('graphics', 'SDDG', ['sddg.png']) },
    { name: 'TOIMMYART', images: folderImages('graphics', 'TOIMMYART', ['18 (3).png', '19 (2).png', '26 (4).png', 'April ME.png']) },
  ],
};

const heroTextLength = 'DESIGN THATMAKES YOU LOOK.'.length;

const normalizePathname = (pathname) => pathname.replace(/\/+$/, '') || '/';

const getFolderSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

const getRevealStyle = (index) => ({ transitionDelay: `${Math.min(index * 90, 630)}ms` });

const getWorkSelection = (pathname) => {
  const [, route, categorySlug, folderSlug] = pathname.split('/');
  if (route !== 'work') return { category: null, folder: null };

  const category = categorySlug === 'branding'
    ? 'branding'
    : categorySlug === 'social-media'
      ? 'social-media'
      : null;

  if (!category) return { category: null, folder: null };

  const folder = folderSlug
    ? portfolioFolders[category].find((project) => getFolderSlug(project.name) === folderSlug) ?? null
    : null;

  return { category, folder };
};

const getRouteTarget = (pathname) => {
  if (pathname === '/' || pathname === '/work' || pathname.startsWith('/work/')) {
    return pathname === '/' ? null : 'work';
  }

  return {
    '/about': 'about',
    '/services': 'services',
    '/resume': 'cv',
    '/contact': 'contact',
  }[pathname] ?? null;
};

function App() {
  useScrollReveal();

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('toimmyart-theme') || 'dark';
  });

  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('toimmyart-theme', theme);
  }, [theme]);

  const [formData, setFormData] = useState({ name: '', email: '', project: '', message: '' });
  const [formError, setFormError] = useState('');
  const [pathname, setPathname] = useState(() => normalizePathname(window.location.pathname));
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [typedCharacters, setTypedCharacters] = useState(() => (
    window.matchMedia('(prefers-reduced-motion: reduce)').matches ? heroTextLength : 0
  ));
  const menuButtonRef = useRef(null);
  const { category: selectedCategory, folder: selectedFolder } = getWorkSelection(pathname);

  useEffect(() => {
    if (window.location.hash) {
      window.history.replaceState(window.history.state, '', window.location.pathname + window.location.search);
    }
  }, []);

useEffect(() => {
  const onPopState = () => {
    setPathname(normalizePathname(window.location.pathname));
    setIsMenuOpen(false);
    window.dispatchEvent(new Event('portfolio:navigate'));
  };

  window.addEventListener('popstate', onPopState);

  return () => {
    window.removeEventListener('popstate', onPopState);
  };
}, []);
  
  useEffect(() => {
    const targetId = getRouteTarget(pathname);
    const frame = window.requestAnimationFrame(() => {
      if (targetId) {
        document.getElementById(targetId)?.scrollIntoView({
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
          block: 'start',
        });
      } else {
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
        });
      }
    });
    return () => window.cancelAnimationFrame(frame);
  }, [pathname]);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    let typingTimer;
    let startDelay;
    const completeTyping = () => {
      if (motionPreference.matches) {
        window.clearTimeout(startDelay);
        window.clearInterval(typingTimer);
        setTypedCharacters(heroTextLength);
      }
    };
    motionPreference.addEventListener('change', completeTyping);

    startDelay = motionPreference.matches ? undefined : window.setTimeout(() => {
      typingTimer = window.setInterval(() => {
        setTypedCharacters((count) => {
          if (count >= heroTextLength) {
            window.clearInterval(typingTimer);
            return heroTextLength;
          }
          return count + 1;
        });
      }, 65);
    }, 180);

    return () => {
      if (startDelay !== undefined) window.clearTimeout(startDelay);
      window.clearInterval(typingTimer);
      motionPreference.removeEventListener('change', completeTyping);
    };
  }, []);

  useEffect(() => {
    if (!isMenuOpen) return undefined;
    const closeOnEscape = (event) => {
      if (event.key === 'Escape') {
        setIsMenuOpen(false);
        menuButtonRef.current?.focus();
      }
    };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [isMenuOpen]);

 const navigateTo = (path, event) => {
  if (
    event &&
    (event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey)
  ) {
    return;
  }

  event?.preventDefault();
  const nextPath = normalizePathname(path);

  if (nextPath !== pathname) {
    window.history.pushState({}, '', nextPath);
    setPathname(nextPath);
  } else {
    if (window.location.pathname !== nextPath || window.location.hash) {
      window.history.replaceState(window.history.state, '', nextPath);
    }

    const targetId = getRouteTarget(nextPath);
    const behavior = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches
      ? 'auto'
      : 'smooth';

    if (targetId) {
      document.getElementById(targetId)?.scrollIntoView({
        behavior,
        block: 'start',
      });
    } else {
      window.scrollTo({ top: 0, behavior });
    }
  }

  setIsMenuOpen(false);
  window.dispatchEvent(new Event('portfolio:navigate'));
};

const handleInternalLink = (path) => (event) => navigateTo(path, event);

  const handleFieldChange = (event) => {
    const { name, value } = event.target;
    setFormData((currentData) => ({ ...currentData, [name]: value }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const message = formData.message.trim();
    const [emailName, emailDomain, ...extraParts] = email.split('@');

    if (!name || !email || !message) {
      setFormError('Please add your name, email, and project brief before sending.');
      return;
    }
    if (!emailName || !emailDomain || extraParts.length || !emailDomain.includes('.') || emailDomain.startsWith('.') || emailDomain.endsWith('.')) {
      setFormError('Please enter a valid email address.');
      return;
    }

    const subject = encodeURIComponent('New project inquiry from ' + name);
    const body = encodeURIComponent('Name: ' + name + '\nEmail: ' + email + '\nProject type: ' + (formData.project.trim() || 'Not specified') + '\n\nProject brief:\n' + message);
    setFormError('');
    window.location.href = 'mailto:timothyiretomiwa@gmail.com?subject=' + subject + '&body=' + body;
  };

  const handleCVAction = (action) => {
    if (action === 'view') {
      Toast.fire({
        icon: 'success',
        title: 'Opening CV...'
      });
    } else {
      Toast.fire({
        icon: 'success',
        title: 'Downloading CV...'
      });
    }
  };

  return (
    <main>
<nav className="navbar">
  <a
    href="/"
    className="brand"
    aria-label="ToimmyArt home"
    onClick={handleInternalLink('/')}
  >
    <img src="/logo.png" alt="ToimmyArt Studio logo" />
  </a>

  {/* Mobile theme toggle — outside the dropdown */}
  <button
    type="button"
    className="theme-toggle mobile-theme-toggle"
    onClick={() =>
      setTheme((current) => current === 'dark' ? 'light' : 'dark')
    }
    aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
  >
    <FontAwesomeIcon
      icon={theme === 'dark' ? faSun : faMoon}
      aria-hidden="true"
    />
  </button>

  {/* Mobile hamburger menu — only one is needed */}
  <button
    ref={menuButtonRef}
    type="button"
    className="mobile-menu-toggle"
    aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
    aria-expanded={isMenuOpen}
    aria-controls="primary-navigation"
    onClick={() => setIsMenuOpen((open) => !open)}
  >
    <FontAwesomeIcon
      icon={isMenuOpen ? faXmark : faBars}
      aria-hidden="true"
    />
  </button>

  <div
    className={`nav-menu${isMenuOpen ? ' is-open' : ''}`}
    id="primary-navigation"
  >
    <div className="nav-links">
      <a href="/work" onClick={handleInternalLink('/work')}>
        Work <sup>02</sup>
      </a>
      <a href="/about" onClick={handleInternalLink('/about')}>About</a>
      <a href="/services" onClick={handleInternalLink('/services')}>Services</a>
      <a href="/resume" onClick={handleInternalLink('/resume')}>Resume</a>
    </div>

    {/* Desktop theme toggle — before the project button */}
    <button
      type="button"
      className="theme-toggle desktop-theme-toggle"
      onClick={() =>
        setTheme((current) => current === 'dark' ? 'light' : 'dark')
      }
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <FontAwesomeIcon
        icon={theme === 'dark' ? faSun : faMoon}
        aria-hidden="true"
      />
    </button>

    <a
      href="/contact"
      className="nav-cta"
      onClick={handleInternalLink('/contact')}
    >
      Discuss a project{' '}
      <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" />
    </a>
  </div>
</nav>

      <section className="hero reveal" id="home">
        <div className="hero-kicker">
          <span className="status-dot" />
          <FontAwesomeIcon icon={faLocationDot} style={{marginRight: '4px', fontSize: '0.7rem'}} />
          INDEPENDENT DESIGNER / LAGOS, NG
        </div>

        <div className="hero-title-wrap">
          <h1 className="hero-title" aria-label="Design that makes you look.">
            <span className="typing-line" aria-hidden="true">
              {'DESIGN THAT'.slice(0, typedCharacters)}
              {typedCharacters <= 11 && <span className="typing-caret" />}
            </span>
            <span className="typing-line" aria-hidden="true">
              {'MAKES YOU '.slice(0, Math.max(0, typedCharacters - 11))}
              <span className="different">{'LOOK'.slice(0, Math.max(0, typedCharacters - 21))}</span>
              <span className="period">{typedCharacters > 25 ? '.' : ''}</span>
              {typedCharacters > 11 && <span className="typing-caret" />}
            </span>
          </h1>
        </div>

        <div className="hero-lower">
          <div className="hero-art hero-photo">
          <img
    src="/images/tom.png"
    alt="Iretomiwa Akinbobola, graphic designer"
           />
           <span className="art-label">TOIMMYART / THE DESIGNER</span>
</div>

          <div className="hero-intro">
            <p className="eyebrow">THE DESIGNER BEHIND THE WORK</p>
            <p className="intro-copy">
              I&apos;m Iretomiwa, lead designer at Toimmyart Studio, with four years of experience creating thoughtful brand identities, illustrations, and campaign visuals.
            </p>
            <a href="/work" className="text-link" onClick={handleInternalLink('/work')}>
              EXPLORE SELECTED WORK <FontAwesomeIcon icon={faArrowRight} style={{marginLeft: '15px', transform: 'rotate(45deg)'}} />
            </a>
            <div className="hero-index">
              <span>GRAPHIC DESIGN</span>
              <span>BRAND IDENTITY</span>
              <span>VISUAL STORIES</span>
            </div>
          </div>
        </div>

        <div className="hero-footer">
          <span>INDEPENDENT BY NATURE.</span>
          <span>CREATIVE BY DESIGN.</span>
          <a href="/work" onClick={handleInternalLink('/work')}>SCROLL TO EXPLORE <FontAwesomeIcon icon={faArrowDown} /></a>
        </div>
      </section>

      <section className="work-section reveal" id="work">
        <div className="section-heading">
          <div>
            <p className="eyebrow">A FEW THINGS I'VE MADE</p>
            <h2>Selected <span>work.</span></h2>
          </div>
          <p className="section-note">
            Focused work in branding and social-first visuals that make a lasting impression.
          </p>
        </div>

        {!selectedCategory ? (
          <div className="project-grid">
            {projects.map((project, index) => (
              <a
                href={`/work/${project.type}`}
                className="project-card reveal-item"
                key={project.number}
                onClick={handleInternalLink(`/work/${project.type}`)}
                aria-label={`Browse ${project.title} projects`}
                style={getRevealStyle(index)}
              >
                <div className={`project-art ${project.style}`}>
                  <span className="project-number">{project.number} / {projects.length}</span>
                  <span className="project-mark">{project.mark}</span>
                  <span className="project-detail">{project.detail}</span>
                  <span className="project-arrow"><FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
                </div>
                <div className="project-caption">
                  <div>
                    <h3>{project.title}</h3>
                    <p>{project.category}</p>
                  </div>
                  <span className="project-type">Explore folders</span>
                </div>
              </a>
            ))}
          </div>
        ) : (
          <div className="folder-browser" key={selectedFolder ? selectedFolder.name : selectedCategory}>
            {selectedFolder ? (
              <>
                <div className="folder-browser-heading">
                  <a className="back-button" href={`/work/${selectedCategory}`} onClick={handleInternalLink(`/work/${selectedCategory}`)}>
                    <FontAwesomeIcon icon={faArrowLeft} /> All {selectedCategory === 'branding' ? 'branding' : 'social graphics'} folders
                  </a>
                  <div>
                    <p className="eyebrow">{selectedCategory === 'branding' ? 'BRANDING' : 'SOCIAL MEDIA GRAPHICS'}</p>
                    <h3>{selectedFolder.name}</h3>
                    <p>{selectedFolder.images.length} {selectedFolder.images.length === 1 ? 'project image' : 'project images'}</p>
                  </div>
                </div>
                <div className="folder-image-grid">
                  {selectedFolder.images.map((image, index) => (
                    <figure className="folder-image-card reveal-item" key={image} style={getRevealStyle(index)}>
                      <img src={image} alt={`${selectedFolder.name} portfolio design ${index + 1}`} loading="lazy" />
                    </figure>
                  ))}
                </div>
              </>
            ) : (
              <>
                <div className="folder-browser-heading">
                  <a className="back-button" href="/work" onClick={handleInternalLink('/work')}>
                    <FontAwesomeIcon icon={faArrowLeft} /> All work
                  </a>
                  <div>
                    <p className="eyebrow">{selectedCategory === 'branding' ? 'BRANDING' : 'SOCIAL MEDIA GRAPHICS'}</p>
                    <h3>Choose a project folder</h3>
                    <p>Open a folder to see every image in that project.</p>
                  </div>
                </div>
                <div className="folder-card-grid">
                  {portfolioFolders[selectedCategory].map((folder, index) => (
                    <a
                      className="folder-card reveal-item"
                      key={folder.name}
                      href={`/work/${selectedCategory}/${getFolderSlug(folder.name)}`}
                      onClick={handleInternalLink(`/work/${selectedCategory}/${getFolderSlug(folder.name)}`)}
                      style={getRevealStyle(index)}
                    >
                      <span className="folder-cover">
                        <img src={folder.images[0]} alt={`Preview of ${folder.name}`} loading="lazy" />
                        <span className="folder-image-count">{folder.images.length} {folder.images.length === 1 ? 'image' : 'images'}</span>
                      </span>
                      <span className="folder-card-title">{folder.name}</span>
                      <span className="folder-card-action">Open project <FontAwesomeIcon icon={faArrowUpRightFromSquare} /></span>
                    </a>
                  ))}
                </div>
              </>
            )}
          </div>
        )}
      </section>

      <section className="about-section reveal" id="about">
        <p className="eyebrow">A LITTLE ABOUT MY APPROACH</p>
        <h2>Creative thinking. <span>Design with purpose.</span></h2>
        <p>
          With a strong grasp of colour, typography, and composition, I bring practical ideas to life through branding, illustrations, and visual communication that connect with people.
        </p>
      </section>

      <section className="services-section reveal" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow">CREATIVE SERVICES</p>
            <h2>What I <span>Do.</span></h2>
          </div>
          <p className="section-note">Thoughtful visuals that help brands connect with people.</p>
        </div>
       
        <div className="service-grid">
          {[
            {
              title: 'Logo & Brand Identity Design',
              description: 'Distinctive logos and cohesive brand identities that help businesses build recognition and consistency.',
            },
            {
              title: 'Social Media Graphics',
              description: 'Engaging social posts and promotional visuals designed to communicate clearly and capture attention.',
            },
            {
              title: 'Print Media & Banners',
              description: 'Flyers, banners, posters, brochures, and other designs prepared for print.',
            },
            {
              title: 'Digital Illustrations',
              description: 'Original digital artwork and custom illustrations that bring ideas to life.',
            },
            {
              title: 'Marketing Design',
              description: 'Creative promotional materials that help businesses showcase their products, services, and campaigns.',
            },
            {
              title: 'Product Packaging Design',
              description: 'Thoughtful packaging, labels, and product visuals that reflect a brand’s identity.',
            },
          ].map((service, index) => (
            <article
              className="service-card reveal-item"
              key={service.title}
              style={getRevealStyle(index)}
            >
              <span className="service-number">
                {String(index + 1).padStart(2, '0')}
              </span>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <span className="service-arrow" aria-hidden="true">↗</span>
            </article>
          ))}
        </div>

        <div className="tools-of-trade reveal-item">
          <div className="tools-heading">
            <p className="eyebrow">DESIGN SOFTWARE</p>
            <h3>Tools of My Trade</h3>
          </div>
          <div className="software-tools-grid">
            {[
              { name: 'Concepts', image: '3.png' },
              { name: 'Adobe Photoshop', image: '4.png' },
              { name: 'Adobe Illustrator', image: '5.png' },
              { name: 'Sketchbook', image: '6.png' },
            ].map((tool, index) => (
              <div className="software-tool reveal-item" key={tool.name} style={getRevealStyle(index)}>
                <img src={`/software/${tool.image}`} alt="" loading="lazy" decoding="async" />
                <span>{tool.name}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="cv-section reveal" id="cv">
        <div className="section-heading">
          <div>
            <p className="eyebrow">QUALIFICATIONS & EXPERIENCE</p>
            <h2>My <span>Resume.</span></h2>
          </div>
          <div className="cv-actions">
            <a 
              href="/CV_Iretomiwa_Akinbobola.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="cv-btn view-btn"
              onClick={() => handleCVAction('view')}
            >
              <FontAwesomeIcon icon={faEye} /> View CV
            </a>
            <a 
              href="/CV_Iretomiwa_Akinbobola.pdf" 
              download 
              className="cv-btn download-btn"
              onClick={() => handleCVAction('download')}
            >
              <FontAwesomeIcon icon={faDownload} /> Download PDF
            </a>
          </div>
        </div>
        <div className="cv-preview-box">
          <div className="cv-placeholder">
             <FontAwesomeIcon icon={faFilePdf} size="4x" color="var(--orange)" />
             <p>Resume Preview Available Upon Opening</p>
          </div>
        </div>
      </section>

      <footer className="contact-section reveal" id="contact">
        <div className="contact-layout">
          <div className="contact-copy">
            <p className="eyebrow">HAVE A PROJECT IN MIND?</p>
            <h2>Let&apos;s create<br /><span>something meaningful.</span></h2>
            <p>Tell me about your brand, campaign, or design needs. I&apos;ll get back to you to discuss how we can bring your ideas to life.</p>
          </div>
          <form className="contact-form" onSubmit={handleSubmit} noValidate>
            <label>Name<input type="text" name="name" value={formData.name} onChange={handleFieldChange} placeholder="Your name" autoComplete="name" required /></label>
            <label>Email<input type="email" name="email" value={formData.email} onChange={handleFieldChange} placeholder="you@example.com" autoComplete="email" required /></label>
            <label>Project type<input type="text" name="project" value={formData.project} onChange={handleFieldChange} placeholder="Branding, campaign, product, etc." /></label>
            <label>Project brief<textarea name="message" value={formData.message} onChange={handleFieldChange} placeholder="Tell me about your goals, timeline, and what you need." rows={5} required /></label>
            {formError ? <p className="form-error" aria-live="polite">{formError}</p> : null}
            <p className="form-note">Submitting opens your email app with the project details ready to send.</p>
            <button type="submit" className="submit-button">Send project enquiry <FontAwesomeIcon icon={faArrowUpRightFromSquare} aria-hidden="true" /></button>
          </form>
        </div>
        <div className="end-work-highlight" aria-label="Selected end work">
          <p className="eyebrow">More From The Studio:</p>
          <div className="end-work-grid">
            {endWorkImages.map((image) => (
              <img
                key={image.src}
                src={image.src}
                alt={image.alt}
                loading="lazy"
                decoding="async"
              />
            ))}
          </div>
        </div>
        <div className="social-links" aria-label="Social media">
          {socialLinks.map((social) => (
            <a href={social.href} key={social.label} aria-label={social.label} title={social.label} target="_blank" rel="noreferrer">
              <FontAwesomeIcon icon={social.icon} aria-hidden="true" />
            </a>
          ))}
        </div>
        <div className="contact-bottom">
          <a href="/" className="brand" aria-label="ToimmyArt home" onClick={handleInternalLink('/')}><img src="/logo.png" alt="ToimmyArt Studio logo" /></a>
          <span><FontAwesomeIcon icon={faLocationDot} /> LAGOS, NIGERIA</span>
          <span>&copy; TOIMMYART STUDIO</span>
        </div>
      </footer>

      </main>
  )
}

export default App
    
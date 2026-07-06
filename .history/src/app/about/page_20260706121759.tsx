"use client"
import { motion, Variants } from "framer-motion" 

export default function About() {

    const container = {
        hidden: {},
        show: {
            transition: {
                staggerChildren: 0.08,
            },
        },
    }
    
    const block: Variants = {
        hidden: {
            opacity: 0,
            y: 30,
            filter: "blur(10px)",
        },
        show: {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            transition: {
                duration: 0.8,
                ease: [0.76, 0, 0.24, 1],
            },
        },
    }
    
    const line: Variants = {
        hidden: {
            opacity: 0,
            y: 10,
        },
        show: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.5,
                ease: [0.22, 1, 0.36, 1],
            },
        },
    }

    return (
        <motion.section
            className="w-screen min-h-screen flex flex-col px-20 py-20 gap-20"
            variants={container}
            initial="hidden"
            animate="show"
        >
            {/* TEXT BLOCK */}
            <motion.div className="w-4/5 mt-20" variants={block}>
                <motion.p
                    className="text-justify text-sm font-thin font-plex leading-relaxed"
                >
                    {`TERRIER FILM is a lorem ipsum dolor sit amet, consectetur adipiscing elit. Curabitur quis libero condimentum, suscipit quam vel, efficitur magna.`}
                </motion.p>
            </motion.div>

            {/* CONTACT BLOCK */}
            <motion.div className="w-full flex text-sm" variants={block}>
                <div className="w-1/2">
                    <h3 className="uppercase text-gray-200 font-thin mb-4">
                        Contact
                    </h3>

                    <div className="flex flex-col gap-6 font-plex">
                        {[
                            {
                                name: "Alejo Ayala",
                                role: "Founder, Director",
                                mail: "alejo@gmail.com",
                            },
                            {
                                name: "Arturo Casaú",
                                role: "Director",
                                mail: "arturo@gmail.com",
                            },
                            {
                                name: "Sergi Pascual",
                                role: "Executive Producer",
                                mail: "sergiopascualterrier@gmail.com",
                            }
                        ].map((person, i) => (
                            <motion.div key={i} variants={block}>
                                <motion.p variants={line}>{person.name}</motion.p>
                                <motion.p variants={line}>{person.role}</motion.p>
                                <motion.p variants={line}>{person.mail}</motion.p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* OFFICE BLOCK */}
                <div className="flex flex-col gap-20 font-plex">
                    <motion.div variants={block}>
                        <h3 className="uppercase text-gray-200 font-thin mb-4">
                            Office
                        </h3>

                        <motion.div className="flex flex-col gap-1">
                            <motion.p variants={line}>Calle Definición 203</motion.p>
                            <motion.p variants={line}>08010 Barcelona</motion.p>
                            <motion.p variants={line}>España</motion.p>
                        </motion.div>
                    </motion.div>

                    <motion.div className="flex flex-col gap-2 uppercase" variants={block}>
                        <motion.a variants={line}>Vimeo</motion.a>
                        <motion.a variants={line}>Instagram</motion.a>
                    </motion.div>
                </div>
            </motion.div>
        </motion.section>
    )
}
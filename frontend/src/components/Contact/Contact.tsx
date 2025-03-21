import React from "react";
import styled from "styled-components";
import { Container } from "../../styles/styles";

const ContactContainer = styled(Container)`
    max-width: 800px;
    padding: 40px 20px;
    margin: 0 auto;
    background-color: ${props => props.theme.cardBg};
    color: ${props => props.theme.text};
`;

const Title = styled.h2`
    font-size: 2.5em;
    margin-bottom: 30px;
    text-align: center;
    font-weight: 700;

    @media (max-width: 768px) {
        font-size: 2em;
    }
`;

const Description = styled.p`
    font-size: 18px;
    line-height: 1.8;
    color: ${props => props.theme.text};
    margin: 20px 0 40px;
    text-align: center;
    max-width: 600px;
    margin: 0 auto 40px;

    @media (max-width: 768px) {
        font-size: 16px;
    }
`;

const ContactCard = styled.div`
    background: ${props => props.theme.cardBg};
    padding: 30px;
    border-radius: 12px;
    box-shadow: ${props => props.theme.shadow};
    transition: transform 0.3s ease;
    max-width: 400px;
    margin: 0 auto;
    border: 1px solid ${props => props.theme.border};

    &:hover {
        transform: translateY(-5px);
    }
`;

const CardTitle = styled.h3`
    font-size: 20px;
    color: ${props => props.theme.text};
    margin-bottom: 15px;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;

    svg {
        color: ${props => props.theme.linkColor};
    }
`;

const CardContent = styled.div`
    font-size: 16px;
    color: ${props => props.theme.text};
    line-height: 1.6;

    strong {
        color: ${props => props.theme.text};
    }
`;

const CenteredCardContent = styled(CardContent)`
    text-align: center;
`;

const EmailLink = styled.a`
    color: ${props => props.theme.linkColor};
    text-decoration: none;
    font-weight: bold;
    transition: color 0.3s ease;
    cursor: pointer;

    &:hover {
        color: ${props => props.theme.linkHover};
        text-decoration: underline;
    }

    &:active {
        opacity: 0.8;
    }
`;

const handleEmailClick = (email: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    window.location.href = `mailto:${email}`;
};

export default function Contact() {
    return (
        <ContactContainer>
            <Title>Contact</Title>
            <Description>
                This is our contact. Feel free to reach out to us if you have any questions or concerns. We will ignore it.
            </Description>

            <ContactCard>
                <CardTitle>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                        <path d="M22 6l-10 7L2 6"/>
                    </svg>
                    Contact Information
                </CardTitle>
                <CenteredCardContent>
                    <p>
                        <EmailLink
                            href="mailto:Phoenix.bouma@gmail.com"
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            Phoenix.bouma@gmail.com
                        </EmailLink>
                    </p>
                    <p>
                        <EmailLink
                            href="mailto:dangducduy.nguyen@ucalgary.ca"
                            onClick={handleEmailClick('dangducduy.nguyen@ucalgary.ca')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            dangducduy.nguyen@ucalgary.ca
                        </EmailLink>
                    </p>
                    <p>
                        <EmailLink
                            href="mailto:jerome.barcelona@ucalgary.ca"
                            onClick={handleEmailClick('jerome.barcelona@ucalgary.ca')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            jerome.barcelona@ucalgary.ca
                        </EmailLink>
                    </p>
                    <p>
                        <EmailLink
                            href="mailto:jaival.patel@ucalgary.ca"
                            onClick={handleEmailClick('jaival.patel@ucalgary.ca')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            jaival.patel@ucalgary.ca
                        </EmailLink>
                    </p>
                    <p>
                        <EmailLink
                            href="mailto:muhammad.qureshi4@ucalgary.ca"
                            onClick={handleEmailClick('muhammad.qureshi4@ucalgary.ca')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            muhammad.qureshi4@ucalgary.ca
                        </EmailLink>
                    </p>
                    <p>
                        <EmailLink
                            href="mailto:talaal.irtija@ucalgary.ca"
                            onClick={handleEmailClick('talaal.irtija@ucalgary.ca')}
                            target="_blank"
                            rel="noopener noreferrer"
                        >
                            talaal.irtija@ucalgary.ca
                        </EmailLink>
                    </p>
                </CenteredCardContent>
            </ContactCard>
        </ContactContainer>
    );
}
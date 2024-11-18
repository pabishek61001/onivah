import { Container } from '@mui/material';
import React from 'react';



const GallerySection = () => {
    return (
        <Container>
            <div className='list'>
                <img src={require("../images/Leonardo_Kino_XL_wedding_hall_decorations_luxury_video_1.jpg")} />
                <img src="https://images.squarespace-cdn.com/content/v1/6564afb4f0851760cfcdde58/65d81608-1723-4239-aee5-a7e166ff0fb1/Zahan-Rida-Reception-ITC-Chennai-0735.jpg" />
                <img src="https://www.chennaiconventioncentre.com/wp-content/uploads/2019/03/ccc-blog-824x412.jpg" />
                <img src="https://th.bing.com/th/id/OIG1.wQ7nqzXG6LLji1s3MrOP" />
                <img src="https://aaftonline.com/blog/wp-content/uploads/2024/01/What-are-the-Benefits-of-Photography-Complete-Overview.png" />

            </div>
        </Container>
    );
};

export default GallerySection;

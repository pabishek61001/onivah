import { useState } from 'react';
import {
    Box,
    Button,
    Typography,
    CircularProgress,
    Paper,
    Grid,
    TextField,
    IconButton
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import InfoIcon from '@mui/icons-material/Info';
import StarIcon from '@mui/icons-material/Star';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';


// Map 4 icons - You can customize icons as you want
const icons = [
    <StarIcon color="primary" sx={{ fontSize: 40 }} />,
    <ThumbUpIcon color="secondary" sx={{ fontSize: 40 }} />,
    <VerifiedUserIcon color="success" sx={{ fontSize: 40 }} />,
    <InfoIcon color="action" sx={{ fontSize: 40 }} />,
];



export default function WhyChooseUsGenerator({ description, customFields = [], customPricing = [], onGenerate }) {
    const [loading, setLoading] = useState(false);
    const [rawText, setRawText] = useState('');
    const [reasons, setReasons] = useState([]);

    const generateReasons = async () => {
        setLoading(true);
        setRawText('');
        setReasons([]);

        // Combine both arrays
        const combinedFields = [...customFields, ...customPricing];

        // Filter and map to formatted strings
        const extraDetails = combinedFields
            .filter(field => field.name && field.value !== null && field.value !== "" && field.value !== 0)
            .map(field => `${field.name}: ${field.value}`)
            .join('\n');

        // Build combined description with custom fields
        // const extraDetails = customFields
        //     .filter(field => field.name && field.value)
        //     .map(field => `${field.name}: ${field.value}`)
        //     .join('\n');

        const combinedDescription = `${description}\n\nAdditional Info:\n${extraDetails}`;

        const res = await fetch('http://localhost:11434/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: 'mistral',
                prompt: `Based on the following vendor description, generate 4 compelling reasons to include in a \"Why Choose Us\" section for a wedding service website.\n\nEach reason should have:\n- A clear and catchy title (e.g., \"Experienced Team\")\n- A short description (no more than 25 words)\n\nVendor Details:\n${combinedDescription}\n\nFormat:\n1. <Title>: <Short Description>\n2. ...\n3. ...\n4. ...`,
            }),
        });

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullText = '';

        while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split('\n');
            buffer = lines.pop();

            for (const line of lines) {
                try {
                    const parsed = JSON.parse(line);
                    if (parsed.response) {
                        fullText += parsed.response;
                        setRawText(prev => prev + parsed.response);
                    }
                } catch (err) {
                    console.warn('Failed to parse line:', line);
                }
            }
        }

        const parsedReasons = parseReasons(fullText);
        setReasons(parsedReasons);

        if (onGenerate && typeof onGenerate === 'function') {
            onGenerate(parsedReasons);
        }

        setLoading(false);
    };

    const parseReasons = (text) => {
        const reasonLines = text.split(/\n|\r/).filter(line => line.trim().match(/^\d+\./));
        return reasonLines.map((line) => {
            const match = line.match(/^\d+\.\s*(.+?):\s*(.+)/);
            return match ? { title: match[1].trim(), description: match[2].trim() } : null;
        }).filter(Boolean);
    };

    return (
        <Box mt={4}>
            <Button
                variant="contained"
                onClick={generateReasons}
                disabled={loading}
            >
                {loading ? <CircularProgress size={24} /> : 'Generate Why Choose Us'}
            </Button>

            {loading && (
                <Box mt={2}>
                    <CircularProgress />
                    <Typography variant="body2" ml={2}>Generating reasons...</Typography>
                </Box>
            )}

            <Grid container spacing={3} mt={2}>
                {reasons.map((reason, idx) => (
                    <Grid item xs={12} sm={6} md={6} key={idx}>
                        <Paper
                            elevation={4}
                            sx={{
                                p: 3,
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 2,
                                borderRadius: 3,
                                bgcolor: 'background.paper',
                                boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
                                minHeight: 140,
                            }}
                        >
                            <Box sx={{ mt: 0.5 }}>{icons[idx % icons.length]}</Box>
                            <Box>
                                <Typography variant="h6" fontWeight="600" gutterBottom>
                                    {reason.title}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" lineHeight={1.4}>
                                    {reason.description}
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>
                ))}
            </Grid>

        </Box>
    );
}


